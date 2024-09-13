export const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

export const initializeIndexedDb = () => {
  const request = idb.open("app-db", 1);

  request.onupgradeneeded = function () {
    const db = request.result;
    if (!db.objectStoreNames.contains("users")) {
      const userStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
      userStore.createIndex("email", "email", { unique: true });
      userStore.createIndex("age", "age", { unique: false });
    }
  };

  request.onerror = function () {
    console.error("Error occurred while opening IndexedDB.");
  };

  request.onsuccess = function () {
    console.log("Database initialized.");
  };
};
