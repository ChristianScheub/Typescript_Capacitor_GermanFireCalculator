import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportDataService } from '../index';

// ---------------------------------------------------------------------------
// Mock @capacitor/core and @capacitor/share
// ---------------------------------------------------------------------------
vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn(() => false) },
}));

vi.mock('@capacitor/share', () => ({
  Share: { share: vi.fn().mockResolvedValue(undefined) },
}));

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function mockBlobAndUrl() {
  const clickSpy = vi.fn();
  const revokeUrlSpy = vi.fn();

  // Blob is available in jsdom, URL.createObjectURL / revokeObjectURL are not
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  globalThis.URL.revokeObjectURL = revokeUrlSpy;

  // Intercept document.createElement('a')
  const origCreate = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      const el = origCreate('a');
      el.click = clickSpy;
      return el;
    }
    return origCreate(tag);
  });

  return { clickSpy, revokeUrlSpy };
}

// ---------------------------------------------------------------------------
// Tests – web platform (Capacitor.isNativePlatform = false)
// ---------------------------------------------------------------------------

describe('exportDataService.exportFireState – web platform', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns a Promise', () => {
    mockBlobAndUrl();
    const result = exportDataService.exportFireState();
    expect(result).toBeInstanceOf(Promise);
  });

  it('triggers an anchor click to download the file', async () => {
    const { clickSpy } = mockBlobAndUrl();
    await exportDataService.exportFireState();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('revokes the object URL after download', async () => {
    const { revokeUrlSpy } = mockBlobAndUrl();
    await exportDataService.exportFireState();
    expect(revokeUrlSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('sets download filename on the anchor element', async () => {
    mockBlobAndUrl();
    let capturedAnchor: HTMLAnchorElement | null = null;
    const origCreate2 = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate2(tag);
      if (tag === 'a') {
        el.click = vi.fn();
        capturedAnchor = el as HTMLAnchorElement;
      }
      return el;
    });
    await exportDataService.exportFireState();
    expect(capturedAnchor).not.toBeNull();
    expect((capturedAnchor as unknown as HTMLAnchorElement).download).toBe('germanFireCalculatorExport.json');
  });

  it('exports "{}" when localStorage has no fire_state_v1', async () => {
    mockBlobAndUrl();
    let blobContent = '';
    const OrigBlob = globalThis.Blob;
    (globalThis as unknown as Record<string, unknown>).Blob = class extends OrigBlob {
      constructor(parts?: BlobPart[], opts?: BlobPropertyBag) {
        blobContent = String((parts ?? [])[0]);
        super(parts, opts);
      }
    };
    await exportDataService.exportFireState();
    expect(blobContent).toBe('{}');
    globalThis.Blob = OrigBlob;
  });

  it('exports the stored fire_state_v1 data', async () => {
    const payload = JSON.stringify({ etfBalance: 100_000 });
    localStorage.setItem('fire_state_v1', payload);
    mockBlobAndUrl();
    let blobContent = '';
    const OrigBlob = globalThis.Blob;
    (globalThis as unknown as Record<string, unknown>).Blob = class extends OrigBlob {
      constructor(parts?: BlobPart[], opts?: BlobPropertyBag) {
        blobContent = String((parts ?? [])[0]);
        super(parts, opts);
      }
    };
    await exportDataService.exportFireState();
    expect(blobContent).toBe(payload);
    globalThis.Blob = OrigBlob;
  });
});

// ---------------------------------------------------------------------------
// Tests – native platform (Capacitor.isNativePlatform = true)
// ---------------------------------------------------------------------------

describe('exportDataService.exportFireState – native platform', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    const { Capacitor } = await import('@capacitor/core');
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
  });

  it('calls Share.share with correct title and dialogTitle', async () => {
    const { Share } = await import('@capacitor/share');
    await exportDataService.exportFireState();
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'germanFireCalculatorExport.json',
        dialogTitle: 'germanFireCalculatorExport.json',
      }),
    );
  });

  it('passes the stored data as text to Share.share', async () => {
    const payload = JSON.stringify({ cashBalance: 5_000 });
    localStorage.setItem('fire_state_v1', payload);
    const { Share } = await import('@capacitor/share');
    await exportDataService.exportFireState();
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({ text: payload }),
    );
  });

  it('passes "{}" when no fire_state_v1 in localStorage', async () => {
    const { Share } = await import('@capacitor/share');
    await exportDataService.exportFireState();
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({ text: '{}' }),
    );
  });
});
