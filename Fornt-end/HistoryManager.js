class HistoryManager {
  static async addEntry(entry) {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage
        console.log("Token:", token);
        if (token) {
          headers.append('Authorization', 'Bearer ' + token); // Append the token to the headers
        }
        console.log(entry);
        console.log("Sending entry data:", JSON.stringify({
          GallonsRequested: entry.GallonsRequested,
          FuelType: entry.FuelType,
          TotalAmountDue: entry.TotalAmountDue,
          DeliveryAddress: entry.DeliveryAddress,
          DeliveryCity: entry.DeliveryCity,
          DeliveryState: entry.DeliveryState,
          DeliveryZipCode: entry.DeliveryZipCode,
          DeliveryDate: entry.DeliveryDate
      }));
        const response = await fetch(`http://localhost:3000/addFuelHistory`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            GallonsRequested: entry.GallonsRequested,
            FuelType: entry.FuelType,
            TotalAmountDue: entry.TotalAmountDue,
            DeliveryAddress: entry.DeliveryAddress,
            DeliveryCity: entry.DeliveryCity,
            DeliveryState: entry.DeliveryState,
            DeliveryZipCode: entry.DeliveryZipCode,
            DeliveryDate: entry.DeliveryDate
          }),
          credentials: 'include'
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
