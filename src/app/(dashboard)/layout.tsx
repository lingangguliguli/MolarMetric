import { getAuthenticatedClinic } from "@/lib/auth-context";
import { getDailyMotivation } from "@/app/actions/motivation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MotivationBanner } from "@/components/layout/motivation-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clinic, profile, role } = await getAuthenticatedClinic();
  const motivation = await getDailyMotivation();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar - Desktop */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header clinic={clinic} profile={profile} role={role} />
        <MotivationBanner initialMotivation={motivation} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
