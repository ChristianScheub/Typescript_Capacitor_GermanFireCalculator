import { useState } from 'react';
import { FireProvider } from './context/FireContext';
import { Dashboard } from './screens/Dashboard';
import { Planner } from './screens/Planner';
import { SteuerEngine } from './screens/SteuerEngine';
import { Menu } from './screens/Menu';
import './App.css';
import type { Tab } from './types/navigation/Tab';
import { BottomNav } from './ui/navigation/BottomNav';

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="app-shell">
      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard onTabChange={setActiveTab} />}
        {activeTab === 'planner'   && <Planner />}
        {activeTab === 'scenarios' && <SteuerEngine />}
        {activeTab === 'menu'      && <Menu />}
      </main>
      <BottomNav active={activeTab} onTabChange={setActiveTab} />
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
