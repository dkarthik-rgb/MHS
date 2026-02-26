import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAcademics(status?: string, category?: string) {
  return useQuery({
    queryKey: [api.academics.list.path, status, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (category) params.append("category", category);
      const res = await fetch(`${api.academics.list.path}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch academics");
      return res.json();
    },
  });
}

export function useStudentLife(status?: string) {
  return useQuery({
    queryKey: [api.studentLife.list.path, status],
    queryFn: async () => {
      const url = status ? `${api.studentLife.list.path}?status=${status}` : api.studentLife.list.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch student life");
      return res.json();
    },
  });
}

export function useAdmissions(status?: string) {
  return useQuery({
    queryKey: [api.admissions.list.path, status],
    queryFn: async () => {
      const url = status ? `${api.admissions.list.path}?status=${status}` : api.admissions.list.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch admissions");
      return res.json();
    },
  });
}

export function useResults(rollNo?: string) {
  return useQuery({
    queryKey: [api.results.list.path, rollNo],
    queryFn: async () => {
      const url = rollNo ? `${api.results.list.path}?rollNo=${rollNo}` : api.results.list.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch results");
      return res.json();
    },
    enabled: !!rollNo || rollNo === undefined,
  });
}

export function useBulkCreateResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any[]) => {
      const res = await fetch(api.results.bulkCreate.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to upload results");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.results.list.path] }),
  });
}
