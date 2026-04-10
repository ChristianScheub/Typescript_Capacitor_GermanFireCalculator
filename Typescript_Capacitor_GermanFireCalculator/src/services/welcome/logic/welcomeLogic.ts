const STORAGE_KEY = 'welcomeAccepted';

export function isWelcomeAccepted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function acceptWelcome(): void {
  localStorage.setItem(STORAGE_KEY, 'true');
}
