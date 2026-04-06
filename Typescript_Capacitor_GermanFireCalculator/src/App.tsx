import { useState } from 'react';
import { FireProvider }      from './context/FireContext';
import { BottomNav }         from './ui/navigation/BottomNav';
import { Dashboard }         from './screens/Dashboard';
import { Planner }           from './screens/Planner';
import { SteuerEngine }      from './screens/SteuerEngine';
import { Menu }              from './screens/Menu';
import { PrognoseScreen }    from './screens/PrognoseScreen';
import type { Tab }          from './types/navigation/Tab';
import type { PrognoseConfig } from './types/prognose/PrognoseConfig';
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
          <PrognoseScreen config={prognoseConfig} onBack={closePrognose} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard onTabChange={handleTabChange} onNavigateToPrognose={navigateToPrognose} />
            )}
            {activeTab === 'planner'   && <Planner />}
            {activeTab === 'scenarios' && <SteuerEngine />}
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
