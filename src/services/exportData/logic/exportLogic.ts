import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

const EXPORT_KEY = 'fire_state_v1';
const EXPORT_FILENAME = 'germanFireCalculatorExport.json';

export async function exportFireState(): Promise<void> {
  const raw = localStorage.getItem(EXPORT_KEY);
  const data = raw ?? '{}';

  if (Capacitor.isNativePlatform()) {
    await Share.share({
      title: EXPORT_FILENAME,
      text: data,
      dialogTitle: EXPORT_FILENAME,
    });
  } else {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = EXPORT_FILENAME;
    a.click();
    URL.revokeObjectURL(url);
  }
}
