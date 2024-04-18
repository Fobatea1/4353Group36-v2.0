class HistoryManager {
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
        // Modify here to include new data fields
        const historyKey = HistoryManager.getHistoryKey();
        const history = HistoryManager.getHistory();
        const extendedEntry = {
            ...entry,
            // Assuming entry already has the new fields if passed correctly from the form submission
        };
        history.push(extendedEntry);
        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    static clearHistory() {
        // Clear the user's history
        const historyKey = HistoryManager.getHistoryKey();
        localStorage.removeItem(historyKey);
    }
}
