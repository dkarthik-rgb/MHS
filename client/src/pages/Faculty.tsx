import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useFaculty } from "@/hooks/use-faculty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone } from "lucide-react";

export default function Faculty() {
  const { data: faculty = [], isLoading } = useFaculty("published");
  const profiles = (faculty as any[]) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 bg-white border-b">
          <div className="container mx-auto px-4 text-center space-y-4 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">Faculty</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Meet the Mentors Behind Montessori EM High School
            </h1>
            <p className="text-base md:text-lg text-slate-600">
              Every published profile below is powered by the admin dashboard, ensuring the public website always reflects
              the latest staff roster, qualifications, and contact information.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : profiles.length === 0 ? (
            <Card className="max-w-2xl mx-auto text-center shadow-lg">
              <CardContent className="py-16 space-y-3">
                <h2 className="text-2xl font-semibold text-primary">Faculty profiles will appear here soon.</h2>
                <p className="text-muted-foreground">
                  The admin team has not published any faculty members yet. Please check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {profiles.map((profile) => (
                <Card key={profile.id} className="mx-auto w-full max-w-sm overflow-hidden border-0 shadow-md">
                  <div className="relative mx-auto h-[360px] w-full overflow-hidden bg-slate-100 sm:h-[400px]">
                    {profile.imageUrl ? (
                      <>
                        <img
                          src={profile.imageUrl}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-20 blur-sm"
                        />
                        <img
                          src={profile.imageUrl}
                          alt={profile.name}
                          className="relative z-10 h-full w-full object-contain object-center"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Image coming soon
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-2 p-5">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <Badge variant="secondary" className="max-w-[65%] truncate">
                        {profile.department}
                      </Badge>
                      {profile.experience && (
                        <span className="max-w-[35%] truncate text-right text-xs uppercase tracking-wide text-muted-foreground">
                          {profile.experience}
                        </span>
                      )}
                    </div>
                    <CardTitle className="break-words text-xl leading-tight sm:text-2xl">{profile.name}</CardTitle>
                    <p className="break-words text-sm font-semibold text-primary">{profile.role}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 p-5 pt-0 text-sm text-slate-600">
                    {profile.qualification && (
                      <p className="break-words">
                        <span className="font-semibold">Qualification: </span>
                        {profile.qualification}
                      </p>
                    )}
                    {profile.description && <p className="break-words leading-relaxed">{profile.description}</p>}
                    <div className="pt-3 space-y-2 text-sm">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="flex min-w-0 items-start gap-2 text-primary hover:underline">
                          <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                          <span className="break-all">{profile.email}</span>
                        </a>
                      )}
                      {profile.phone && (
                        <a href={`tel:${profile.phone}`} className="flex min-w-0 items-start gap-2 text-primary hover:underline">
                          <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                          <span className="break-all">{profile.phone}</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
