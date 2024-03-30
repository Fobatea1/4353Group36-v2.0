const fs = require('fs');
const { JSDOM } = require('jsdom');

// Read the Profile.html file
const html = fs.readFileSync('Profile.html', 'utf8');

describe('User Profile', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Set up a DOM environment using JSDOM
        dom = new JSDOM(html);
        document = dom.window.document;
        window = dom.window;

        // Mock localStorage
        window.localStorage = {
            getItem: jest.fn(() => 'user123')
        };

        // Execute the script in the HTML
        const scriptElement = document.querySelector('script');
        window.eval(scriptElement.textContent);
    });

    test('User profile displays correct username', () => {
        // Trigger DOMContentLoaded event
        window.dispatchEvent(new Event('DOMContentLoaded'));

        // Assert profile displays correct username
        const usernameElement = document.getElementById('username');
        expect(usernameElement.textContent).toBe('user123');
    });

    test('Update profile updates username', () => {
        // Simulate input and button click
        const usernameInput = document.getElementById('newUsername');
        usernameInput.value = 'newUser123';

        const updateButton = document.getElementById('updateButton');
        updateButton.click();

        // Assert profile updates username
        const updatedUsernameElement = document.getElementById('username');
        expect(updatedUsernameElement.textContent).toBe('newUser123');
    });
});
