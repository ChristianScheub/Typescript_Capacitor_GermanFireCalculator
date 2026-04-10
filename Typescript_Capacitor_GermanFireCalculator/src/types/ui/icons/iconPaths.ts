export const IconPaths = {
  // Finance Icons
  wallet: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  trending: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  wallet_2: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/>',

  // Navigation Icons
  chevron: '<polyline points="9 18 15 12 9 6"/>',
  chevron_right: '<polyline points="9 18 15 12 9 6"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />',

  // Info Icons
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round"/>',

  // Utility Icons
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  clock: '<path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" /><path d="M12 6v6l4 2" />',

  // Action Icons
  fullscreen: '<polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />',
  add: '<rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8M12 8v8" />',

  // Chart Icons
  chart: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  grid: '<rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="20.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="17.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="17.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20.5" r="1" fill="currentColor" stroke="none"/>',
} as const;

export type IconName = keyof typeof IconPaths;

export const ICON_SIZES = {
  sm: 16,
  md: 18,
  lg: 24,
} as const;

export type IconSize = keyof typeof ICON_SIZES;
