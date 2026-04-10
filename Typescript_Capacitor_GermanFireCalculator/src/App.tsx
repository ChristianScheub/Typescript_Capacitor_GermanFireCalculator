import { useState }                    from 'react';
import { FireProvider }               from './context/FireContext';
import { BottomNav }                  from './ui/navigation/BottomNav';
import { DashboardContainer }         from './container/Dashboard/DashboardContainer';
import { PlannerContainer }           from './container/Planner/PlannerContainer';
import { SteuerContainer }            from './container/Scenario/ScenarioContainer';
import { Menu }                       from './views/MenuView';
import type { Tab }                   from './types/navigation/Tab';
import './App.css';

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleTabChange = (tab: Tab) => setActiveTab(tab);

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'dashboard' && <DashboardContainer onTabChange={handleTabChange} />}
        {activeTab === 'planner'   && <PlannerContainer />}
        {activeTab === 'scenarios' && <SteuerContainer />}
        {activeTab === 'menu'      && <Menu />}
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
