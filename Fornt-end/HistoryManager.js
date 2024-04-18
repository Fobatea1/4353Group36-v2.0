class HistoryManager {
    static async addEntry(entry) {
        try {
            const payload = {
                gallonsRequested: entry.gallonsRequested,
                deliveryAddress: entry.deliveryAddress,
                deliveryDate: entry.deliveryDate,
                fuelType: entry.fuelType.split(' - ')[0], // Extracting just the type if passed with price
                totalAmountDue: parseFloat(entry.totalAmountDue.replace('$', ''))
            };

            const response = await fetch(`http://localhost:3000/addFuelHistory`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
                credentials: 'include' // Important for sessions managed via HttpOnly cookies
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error adding history entry:', error);
        }
    }

    static async getHistory(username) {
        try {
            const response = await fetch(`http://localhost:3000/getFuelHistory/${username}`, {
                method: 'GET',
                credentials: 'include' // Sending session cookies with the request
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error retrieving history:', error);
        }
    }

    static async clearHistory(username) {
        try {
            const response = await fetch(`http://localhost:3000/clearFuelHistory/${username}`, {
                method: 'DELETE',
                credentials: 'include' // Sending session cookies with the request
            });
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }
}
