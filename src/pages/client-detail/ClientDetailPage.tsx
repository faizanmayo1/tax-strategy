import { Sparkles, Calculator, BookOpenCheck, LineChart, Shield } from "lucide-react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/Tabs";
import { useNavigation } from "@/app/navigation";
import { getClient } from "@/mocks/clients";
import { ClientHeader } from "./ClientHeader";
import { StrategiesTab } from "./StrategiesTab";
import { SimulatorTab } from "./SimulatorTab";
import { BookkeepingTab } from "./BookkeepingTab";
import { CFOTab } from "./CFOTab";
import { EntityTab } from "./EntityTab";

export function ClientDetailPage() {
  const { selectedClientId, page, setPage } = useNavigation();
  const client = getClient(selectedClientId ?? "c-001") ?? getClient("c-001")!;

  // map nav page to tab value
  const tabFromPage =
    page === "simulator"
      ? "simulator"
      : page === "bookkeeping"
        ? "bookkeeping"
        : page === "cfo"
          ? "cfo"
          : page === "tax-strategies" || page === "client-detail"
            ? "strategies"
            : "strategies";

  function setTab(v: string) {
    if (v === "strategies") setPage("tax-strategies");
    else if (v === "simulator") setPage("simulator");
    else if (v === "bookkeeping") setPage("bookkeeping");
    else if (v === "cfo") setPage("cfo");
    else if (v === "entity") setPage("client-detail"); // entity stays under client-detail
  }

  return (
    <div>
      <ClientHeader client={client} />
      <Tabs value={tabFromPage} onValueChange={setTab}>
        <div className="bg-paper border-b border-ink-150 px-8 max-w-[1480px] mx-auto">
          <TabList className="border-0">
            <Tab value="strategies">
              <Sparkles className="h-3.5 w-3.5" /> Tax Strategies
            </Tab>
            <Tab value="simulator">
              <Calculator className="h-3.5 w-3.5" /> Simulator
            </Tab>
            <Tab value="bookkeeping">
              <BookOpenCheck className="h-3.5 w-3.5" /> Bookkeeping
            </Tab>
            <Tab value="cfo">
              <LineChart className="h-3.5 w-3.5" /> CFO Forecasting
            </Tab>
            <Tab value="entity">
              <Shield className="h-3.5 w-3.5" /> Entity & Audit
            </Tab>
          </TabList>
        </div>
        <div className="px-8 py-6 max-w-[1480px] mx-auto">
          <TabPanel value="strategies"><StrategiesTab client={client} /></TabPanel>
          <TabPanel value="simulator"><SimulatorTab client={client} /></TabPanel>
          <TabPanel value="bookkeeping"><BookkeepingTab client={client} /></TabPanel>
          <TabPanel value="cfo"><CFOTab client={client} /></TabPanel>
          <TabPanel value="entity"><EntityTab client={client} /></TabPanel>
        </div>
      </Tabs>
    </div>
  );
}
