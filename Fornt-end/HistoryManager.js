class HistoryManager {
    static getHistoryKey() {
        const username = sessionStorage.getItem('username');
        return `fuelRequestHistory_${username}`;
    }

    static getHistory() {
        const historyKey = HistoryManager.getHistoryKey();
        return fetch(`http://localhost:3000/history/${historyKey}`)
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.error('Error retrieving history:', error));
    }

    static addEntry(entry) {
        const historyKey = HistoryManager.getHistoryKey();
        fetch(`http://localhost:3000/addHistory`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: historyKey, entry})
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error adding history entry:', error));
    }

    static clearHistory() {
        const historyKey = HistoryManager.getHistoryKey();
        fetch(`http://localhost:3000/clearHistory/${historyKey}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error clearing history:', error));
    }
}
