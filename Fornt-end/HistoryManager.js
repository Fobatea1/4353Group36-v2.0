class HistoryManager {
  code-coverage-testing-js
    constructor(storage = window.localStorage, session = window.sessionStorage) {
        this.storage = storage;
        this.session = session;
    }

    getHistoryKey() {
        // Get the username from sessionStorage to create a unique key per user
        const username = this.session.getItem('username');
        return `fuelRequestHistory_${username}`;
    }

    getHistory() {
        // Retrieve history using the unique key
        const historyKey = this.getHistoryKey();
        const history = this.storage.getItem(historyKey);
        return history ? JSON.parse(history) : [];
    }

    addEntry(entry) {
        // Add an entry to the user's history
        const historyKey = this.getHistoryKey();
        const history = this.getHistory();
        history.push(entry);
        this.storage.setItem(historyKey, JSON.stringify(history));
    }

    clearHistory() {
        // Clear the user's history
        const historyKey = this.getHistoryKey();
        this.storage.removeItem(historyKey);
=======
    static getHistoryKey() {
        // Get the username from sessionStorage to create a unique key per user
        const username = sessionStorage.getItem('username');
        return `fuelRequestHistory_${username}`;
    }

    static getHistory() {
        // Retrieve history using the unique key
        const historyKey = HistoryManager.getHistoryKey();
        const history = localStorage.getItem(historyKey);
        return history ? JSON.parse(history) : [];
    }

    static addEntry(entry) {
        // Add an entry to the user's history
        const historyKey = HistoryManager.getHistoryKey();
        const history = HistoryManager.getHistory();
        history.push(entry);
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    static clearHistory() {
        // Clear the user's history
        const historyKey = HistoryManager.getHistoryKey();
        localStorage.removeItem(historyKey);
main
    }
}

// Exporting HistoryManager class for use in other modules or test files
module.exports = HistoryManager;
