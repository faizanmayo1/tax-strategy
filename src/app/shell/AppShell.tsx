import { ToastProvider } from "@/app/providers/ToastProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { NavigationProvider, useNavigation } from "@/app/navigation";
import { AuthGate } from "@/pages/auth/AuthGate";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ClientsPage } from "@/pages/clients/ClientsPage";
import { ClientDetailPage } from "@/pages/client-detail/ClientDetailPage";
import { CompliancePage } from "@/pages/compliance/CompliancePage";
import { DocumentsPage } from "@/pages/documents/DocumentsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { CopilotPage } from "@/pages/copilot/CopilotPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";

function Router() {
  const { page } = useNavigation();
  switch (page) {
    case "dashboard":
      return <DashboardPage />;
    case "clients":
      return <ClientsPage />;
    case "client-detail":
    case "tax-strategies":
    case "simulator":
    case "bookkeeping":
    case "cfo":
      return <ClientDetailPage />;
    case "compliance":
      return <CompliancePage />;
    case "documents":
      return <DocumentsPage />;
    case "reports":
      return <ReportsPage />;
    case "copilot":
      return <CopilotPage />;
    case "settings":
      return <SettingsPage />;
  }
}

export function AppShell() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthGate>
          <NavigationProvider>
            <div className="flex h-full min-h-screen bg-ink-50">
              <Sidebar />
              <div className="flex flex-1 flex-col min-w-0">
                <TopBar />
                <main className="flex-1 overflow-y-auto">
                  <Router />
                </main>
              </div>
            </div>
          </NavigationProvider>
        </AuthGate>
      </AuthProvider>
    </ToastProvider>
  );
}
