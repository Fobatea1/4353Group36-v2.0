class HistoryManager {
    static getHistoryKey() {
        const username = sessionStorage.getItem('username');
        return `fuelRequestHistory_${username}`;
    }

    static getHistory() {
        // Assuming you have an API endpoint that retrieves history by username
        const username = sessionStorage.getItem('username');
        return fetch(`http://localhost:3000/api/history/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                return response.json();
            })
            .then(data => data)
            .catch(error => {
                console.error('Error retrieving history:', error);
                throw error; // Rethrow after logging
            });
    }

    static addEntry(entry) {
        // Assuming you have an API endpoint that adds a history entry
        const username = sessionStorage.getItem('username');
        fetch(`http://localhost:3000/api/addHistory/${username}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(entry)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add history entry');
            }
            return response.text();
        })
        .then(data => console.log('Entry added:', data))
        .catch(error => {
            console.error('Error adding history entry:', error);
            throw error; // Rethrow after logging
        });
    }

    static clearHistory() {
        // Assuming you have an API endpoint that clears history for a user
        const username = sessionStorage.getItem('username');
        fetch(`http://localhost:3000/api/clearHistory/${username}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to clear history');
            }
            return response.text();
        })
        .then(data => console.log('History cleared:', data))
        .catch(error => {
            console.error('Error clearing history:', error);
            throw error; // Rethrow after logging
        });
    }
}
