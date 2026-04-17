import { useState } from "react";
import { FireProvider } from "./context/FireContext";
import { BottomNav } from "./ui/navigation/BottomNav";
import { DashboardContainer } from "./container/Dashboard/DashboardContainer";
import { PlannerContainer } from "./container/Planner/PlannerContainer";
import { SteuerContainer } from "./container/Scenario/ScenarioContainer";
import { MenuContainer } from "./container/Menu/MenuContainer";
import { WelcomeContainer } from "./container/Welcome/WelcomeContainer";
import { welcomeService } from "./services/welcome";
import type { Tab } from "./types/navigation/Tab";
import "./App.css";
import { AdManager } from "./services/Ads/AdManager";

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [welcomeAccepted, setWelcomeAccepted] = useState(() =>
    welcomeService.isAccepted(),
  );

  const handleTabChange = (tab: Tab) => setActiveTab(tab);

  return (
    <div className="app-shell">
      {!welcomeAccepted && (
        <WelcomeContainer onAccept={() => setWelcomeAccepted(true)} />
      )}
      <main className="app-main">
        {!welcomeAccepted && <AdManager />}

        {activeTab === "dashboard" && (
          <DashboardContainer onTabChange={handleTabChange} />
        )}
        {activeTab === "planner" && <PlannerContainer />}
        {activeTab === "scenarios" && <SteuerContainer />}
        {activeTab === "menu" && <MenuContainer />}
      </main>
      <BottomNav active={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <FireProvider>
      <AppShell />
    </FireProvider>
  );
}
