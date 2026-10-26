import { StudyTextbook, Category } from '../types';
import { SAMPLE_TEXTBOOKS } from '../data/sampleGuides';
import { DEFAULT_CATEGORIES } from '../data/categories';

const DB_NAME = 'adhd_learning_hub_db';
const DB_VERSION = 2;
const STORE_NAME = 'custom_guides';
const CATEGORY_STORE_NAME = 'categories';

export function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CATEGORY_STORE_NAME)) {
        db.createObjectStore(CATEGORY_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Retrieves all categories: user customized + defaults from IndexedDB.
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CATEGORY_STORE_NAME], 'readonly');
      const store = transaction.objectStore(CATEGORY_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const stored: Category[] = request.result || [];
        if (stored.length === 0) {
          // Initialize with default categories
          saveAllCategories(DEFAULT_CATEGORIES).catch(console.warn);
          resolve(DEFAULT_CATEGORIES);
        } else {
          resolve(stored);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn('Failed to load categories from IndexedDB, returning defaults:', error);
    return DEFAULT_CATEGORIES;
  }
}

/**
 * Saves or updates a single category.
 */
export async function saveCategory(category: Category): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CATEGORY_STORE_NAME);
    const request = store.put(category);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Bulk saves categories.
 */
export async function saveAllCategories(categories: Category[]): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CATEGORY_STORE_NAME);
    for (const cat of categories) {
      store.put(cat);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Deletes a category by ID.
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CATEGORY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CATEGORY_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all textbooks: master presets + custom user guides from IndexedDB.
 */
export async function getAllTextbooks(): Promise<StudyTextbook[]> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const customGuides: StudyTextbook[] = request.result || [];

        // Ensure default presets are always present with isPreset: true
        const presetsWithProtection = SAMPLE_TEXTBOOKS.map((p) => {
          // If user updated a preset locally (e.g. checkmarks), merge custom changes
          const existingOverride = customGuides.find((c) => c.id === p.id);
          return existingOverride ? { ...p, ...existingOverride, isPreset: true } : { ...p, isPreset: true };
        });

        // Any purely custom guides (not in presets)
        const pureCustom = customGuides.filter((c) => !SAMPLE_TEXTBOOKS.some((p) => p.id === c.id));

        const combined = [...presetsWithProtection, ...pureCustom];
        resolve(combined);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn('Failed to load from IndexedDB, returning default master presets:', error);
    return SAMPLE_TEXTBOOKS;
  }
}

/**
 * Saves or updates a textbook in IndexedDB.
 */
export async function saveTextbook(guide: StudyTextbook): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const recordToSave: StudyTextbook = {
      ...guide,
      isPreset: guide.isPreset || false,
      createdAt: guide.createdAt || Date.now()
    };

    const request = store.put(recordToSave);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Deletes a user-generated guide.
 */
export async function deleteTextbook(id: string): Promise<boolean> {
  const isProtected = SAMPLE_TEXTBOOKS.some((p) => p.id === id);
  if (isProtected) {
    throw new Error('Default Master Presets are protected and cannot be deleted.');
  }

  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
