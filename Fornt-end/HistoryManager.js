class HistoryManager {
    static async addEntry(entry) {
        try {
            const response = await fetch(`http://localhost:3000/addFuelHistory`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(entry)
            });
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error('Error adding history entry:', error);
        }
    }

    static async getHistory(username) {
        try {
            const response = await fetch(`http://localhost:3000/getFuelHistory/${username}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error retrieving history:', error);
        }
    }

    static async clearHistory(username) {
        try {
            const response = await fetch(`http://localhost:3000/clearFuelHistory/${username}`, {
                method: 'DELETE'
            });
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }
}
