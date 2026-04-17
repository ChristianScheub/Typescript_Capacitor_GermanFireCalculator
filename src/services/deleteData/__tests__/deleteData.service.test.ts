import { describe, it, expect, beforeEach, vi } from 'vitest';
import { deleteDataService } from '../index';

// jsdom provides localStorage / sessionStorage but no indexedDB.databases()
// We mock it to keep tests environment-independent.
const mockDatabases = vi.fn().mockResolvedValue([]);
const mockDeleteDatabase = vi.fn(() => {
  const req = {
    onsuccess: null as (() => void) | null,
    onerror: null as (() => void) | null,
  };
  Promise.resolve().then(() => req.onsuccess?.());
  return req;
});

Object.defineProperty(globalThis, 'indexedDB', {
  value: { databases: mockDatabases, deleteDatabase: mockDeleteDatabase },
  writable: true,
});

describe('deleteDataService.deleteAllData', () => {
  beforeEach(() => {
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    sessionStorage.setItem('s1', 'v1');
    mockDatabases.mockResolvedValue([]);
    mockDeleteDatabase.mockClear();
  });

  it('clears localStorage', async () => {
    await deleteDataService.deleteAllData();
    expect(localStorage.length).toBe(0);
  });

  it('clears sessionStorage', async () => {
    await deleteDataService.deleteAllData();
    expect(sessionStorage.length).toBe(0);
  });

  it('calls indexedDB.databases to enumerate DBs', async () => {
    await deleteDataService.deleteAllData();
    expect(mockDatabases).toHaveBeenCalled();
  });

  it('calls deleteDatabase for each named DB', async () => {
    mockDatabases.mockResolvedValue([{ name: 'db1' }, { name: 'db2' }]);
    await deleteDataService.deleteAllData();
    expect(mockDeleteDatabase).toHaveBeenCalledTimes(2);
    expect(mockDeleteDatabase).toHaveBeenCalledWith('db1');
    expect(mockDeleteDatabase).toHaveBeenCalledWith('db2');
  });

  it('skips entries without a name', async () => {
    mockDatabases.mockResolvedValue([{ name: undefined }, { name: 'db1' }]);
    await deleteDataService.deleteAllData();
    expect(mockDeleteDatabase).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise (is async)', () => {
    const result = deleteDataService.deleteAllData();
    expect(result).toBeInstanceOf(Promise);
  });
});
