import { useState } from 'react';
import { WelcomeView } from '../../views/WelcomeView';
import { welcomeService } from '../../services/welcome';

interface WelcomeContainerProps {
  readonly onAccept: () => void;
}

export function WelcomeContainer({ onAccept }: WelcomeContainerProps) {
  const [checked, setChecked] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const handleToggle = (index: 0 | 1 | 2) => {
    const next: [boolean, boolean, boolean] = [...checked] as [boolean, boolean, boolean];
    next[index] = !next[index];
    setChecked(next);
  };

  const handleAccept = () => {
    welcomeService.accept();
    onAccept();
  };

  return (
    <WelcomeView
      checked={checked}
      onToggle={handleToggle}
      onAccept={handleAccept}
    />
  );
}
