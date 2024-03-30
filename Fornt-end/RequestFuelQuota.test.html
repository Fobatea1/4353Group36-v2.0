const fs = require('fs');
const { JSDOM } = require('jsdom');

// Read the RequestFuelQuota.html file
const html = fs.readFileSync('RequestFuelQuota.html', 'utf8');

describe('Request Fuel Quota Page', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Set up a DOM environment using JSDOM
        dom = new JSDOM(html);
        document = dom.window.document;
        window = dom.window;

        // Mock API fetch function
        window.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true })
            })
        );

        // Execute the script in the HTML
        const scriptElement = document.querySelector('script');
        window.eval(scriptElement.textContent);
    });

    test('Submitting fuel request form sends data', () => {
        // Simulate filling out the form
        const fuelTypeInput = document.getElementById('fuelType');
        fuelTypeInput.value = 'Diesel';

        const quantityInput = document.getElementById('quantity');
        quantityInput.value = '50';

        // Simulate form submission
        const form = document.getElementById('fuelRequestForm');
        form.dispatchEvent(new Event('submit'));

        // Assert fetch was called with correct data
        expect(window.fetch).toHaveBeenCalledWith('/api/fuel/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fuelType: 'Diesel', quantity: 50 })
        });
    });
});
