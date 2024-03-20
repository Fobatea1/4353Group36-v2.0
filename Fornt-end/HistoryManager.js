// HistoryManager.js

class HistoryManager {
    static getHistoryKey() {
        const username = sessionStorage.getItem('username');
        return `fuelRequestHistory_${username}`;
    }

    static getHistory() {
        const historyKey = this.getHistoryKey();
        const history = localStorage.getItem(historyKey);
        return history ? JSON.parse(history) : [];
    }

    static addEntry(entry) {
        const historyKey = this.getHistoryKey();
        const history = this.getHistory();
        history.push(entry);
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    static clearHistory() {
        const historyKey = this.getHistoryKey();
        localStorage.removeItem(historyKey);
    }
}

// CommonJS module export for Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryManager;
} else {
    // Attach to window for browser environments
    window.HistoryManager = HistoryManager;
}
