"use client";

const DB_NAME = "kyomu-offline";
const DB_VERSION = 1;
const STORE_NAME = "pages";
const META_STORE = "comics";

interface OfflineComic {
  comicId: number;
  title: string;
  pageCount: number;
  downloadedAt: string;
  sizeBytes: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: ["comicId", "pageIndex"] });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "comicId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function downloadComicForOffline(
  comicId: number,
  title: string,
  totalPages: number,
  onProgress: (downloaded: number, total: number) => void,
): Promise<void> {
  const db = await openDb();
  let totalSize = 0;

  for (let i = 0; i < totalPages; i++) {
    const response = await fetch(`/api/comics/${comicId}/pages/${i}`);
    const blob = await response.blob();
    totalSize += blob.size;

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({ comicId, pageIndex: i, blob });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    onProgress(i + 1, totalPages);
  }

  // Save meta
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readwrite");
    const store = tx.objectStore(META_STORE);
    store.put({
      comicId,
      title,
      pageCount: totalPages,
      downloadedAt: new Date().toISOString(),
      sizeBytes: totalSize,
    } satisfies OfflineComic);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

export async function getOfflinePage(comicId: number, pageIndex: number): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get([comicId, pageIndex]);
    request.onsuccess = () => {
      db.close();
      resolve(request.result?.blob ?? null);
    };
    request.onerror = () => {
      db.close();
      resolve(null);
    };
  });
}

export async function isComicAvailableOffline(comicId: number): Promise<boolean> {
  const db = await openDb();
  return new Promise((resolve) => {
    const tx = db.transaction(META_STORE, "readonly");
    const store = tx.objectStore(META_STORE);
    const request = store.get(comicId);
    request.onsuccess = () => {
      db.close();
      resolve(!!request.result);
    };
    request.onerror = () => {
      db.close();
      resolve(false);
    };
  });
}

export async function getOfflineComics(): Promise<OfflineComic[]> {
  const db = await openDb();
  return new Promise((resolve) => {
    const tx = db.transaction(META_STORE, "readonly");
    const store = tx.objectStore(META_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result ?? []);
    };
    request.onerror = () => {
      db.close();
      resolve([]);
    };
  });
}

export async function removeOfflineComic(comicId: number): Promise<void> {
  const db = await openDb();

  // Delete all pages
  const pageTx = db.transaction(STORE_NAME, "readwrite");
  const pageStore = pageTx.objectStore(STORE_NAME);
  const cursor = pageStore.openCursor();
  await new Promise<void>((resolve) => {
    cursor.onsuccess = () => {
      const result = cursor.result;
      if (result) {
        if (result.value.comicId === comicId) {
          result.delete();
        }
        result.continue();
      } else {
        resolve();
      }
    };
  });

  // Delete meta
  const metaTx = db.transaction(META_STORE, "readwrite");
  metaTx.objectStore(META_STORE).delete(comicId);
  await new Promise<void>((resolve) => {
    metaTx.oncomplete = () => resolve();
  });

  db.close();
}

export async function getStorageEstimate(): Promise<{ used: number; quota: number }> {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return { used: estimate.usage ?? 0, quota: estimate.quota ?? 0 };
  }
  return { used: 0, quota: 0 };
}
