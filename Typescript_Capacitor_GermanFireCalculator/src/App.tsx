import { useState }                    from 'react';
import { FireProvider }               from './context/FireContext';
import { BottomNav }                  from './ui/navigation/BottomNav';
import { DashboardContainer }         from './container/Dashboard/DashboardContainer';
import { PlannerContainer }           from './container/Planner/PlannerContainer';
import { SteuerContainer }            from './container/Steuer/SteuerContainer';
import { PrognoseContainer }          from './container/Prognose/PrognoseContainer';
import { Menu }                       from './views/MenuView';
import type { Tab }                   from './types/navigation/Tab';
import type { PrognoseConfig }        from './types/prognose/PrognoseConfig';
import './App.css';

function AppShell() {
  const [activeTab,      setActiveTab]      = useState<Tab>('dashboard');
  const [prognoseConfig, setPrognoseConfig] = useState<PrognoseConfig | null>(null);

  const navigateToPrognose = (cfg: PrognoseConfig) => setPrognoseConfig(cfg);
  const closePrognose      = ()                    => setPrognoseConfig(null);

  const handleTabChange = (tab: Tab) => {
    setPrognoseConfig(null);
    setActiveTab(tab);
  };

  return (
    <div className="app-shell">
      <main className="app-main">
        {prognoseConfig ? (
          <PrognoseContainer config={prognoseConfig} onBack={closePrognose} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardContainer onTabChange={handleTabChange} onNavigateToPrognose={navigateToPrognose} />
            )}
            {activeTab === 'planner'   && <PlannerContainer />}
            {activeTab === 'scenarios' && <SteuerContainer />}
            {activeTab === 'menu'      && <Menu />}
          </>
        )}
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
