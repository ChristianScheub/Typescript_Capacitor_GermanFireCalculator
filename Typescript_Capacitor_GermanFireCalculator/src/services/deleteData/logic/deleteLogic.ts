export async function deleteAllData(): Promise<void> {
  localStorage.clear();
  sessionStorage.clear();
  const dbs = await indexedDB.databases();
  await Promise.all(
    dbs.map(
      db =>
        db.name &&
        new Promise<void>((res, rej) => {
          const req = indexedDB.deleteDatabase(db.name!);
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        }),
    ),
  );
}
