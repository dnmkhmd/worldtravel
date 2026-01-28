/**
 * Simple IndexedDB Wrapper for World Travel Gallery
 * Stores images and videos as Blobs directly in the browser.
 */

const DB_NAME = 'WorldTravelDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_items';

const dbInfo = {
    db: null
};

// Open Database
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (e) => {
            dbInfo.db = e.target.result;
            resolve(dbInfo.db);
        };

        request.onerror = (e) => {
            reject('DB Error: ' + e.target.error);
        };
    });
}

// Add Item (File Blob + Caption)
async function addItem(file, caption) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInfo.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const type = file.type.startsWith('image/') ? 'image' : 'video';

        const item = {
            blob: file,
            type: type,
            caption: caption,
            created: new Date().getTime()
        };

        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

// Get All Items
async function getAllItems() {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInfo.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const items = request.result;
            // Sort by newest first (IndexedDB doesn't sort natively easily)
            items.sort((a, b) => b.created - a.created);
            resolve(items);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}

// Delete Item
async function deleteItem(id) {
    await openDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInfo.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(Number(id)); // ID is number

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}
