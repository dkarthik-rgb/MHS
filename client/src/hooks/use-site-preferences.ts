import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

const preferencesKey = [api.sitePreferences.get.path] as const;

const DEFAULT_ERROR = "Unexpected response from server.";

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim();
}

async function parseJsonResponse(res: Response) {
  const raw = await res.text();
  if (!raw) {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return {};
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    const fallback = stripHtml(raw) || `Unexpected response (status ${res.status})`;
    throw new Error(fallback);
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? (data as Record<string, unknown>).message
        : DEFAULT_ERROR;
    throw new Error(String(message));
  }
  return data;
}

export function useSitePreferences() {
  return useQuery({
    queryKey: preferencesKey,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch(api.sitePreferences.get.path, { credentials: "include" });
      const data = await parseJsonResponse(res);
      return api.sitePreferences.get.responses[200].parse(data);
    },
  });
}

export function useUpdateSitePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: z.infer<typeof api.sitePreferences.update.input>) => {
      const res = await fetch(api.sitePreferences.update.path, {
        method: api.sitePreferences.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await parseJsonResponse(res);
      return api.sitePreferences.update.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(preferencesKey, data);
    },
  });
}
