// HistoryManager.js
class HistoryManager {
    static getHistory() {
        const history = localStorage.getItem('fuelRequestHistory');
        return history ? JSON.parse(history) : [];
    }

    static addEntry(entry) {
        const history = HistoryManager.getHistory();
        history.push(entry);
        localStorage.setItem('fuelRequestHistory', JSON.stringify(history));
    }

    static clearHistory() {
        localStorage.removeItem('fuelRequestHistory');
    }
}
