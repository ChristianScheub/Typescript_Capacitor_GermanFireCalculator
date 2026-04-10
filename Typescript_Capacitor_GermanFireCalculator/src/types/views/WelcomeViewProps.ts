export interface WelcomeViewProps {
  checked: [boolean, boolean, boolean];
  onToggle: (index: 0 | 1 | 2) => void;
  onAccept: () => void;
}
