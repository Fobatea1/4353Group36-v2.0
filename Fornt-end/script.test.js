// script.test.js
// Mock setup for localStorage and sessionStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

// Applying mocks to the global window object
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

// Mock for alert and window.location
window.alert = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: '', assign: jest.fn() },
  writable: true
});

// Reset mocks before each test
beforeEach(() => {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
  window.alert.mockClear();
  window.location.assign.mockClear();

  // Mock your actual DOM elements and their properties/events here
  document.getElementById = jest.fn().mockImplementation((id) => {
    const elements = {
      registerUsername: { value: 'newUser' },
      registerPassword: { value: 'newPassword' },
      loginUsername: { value: 'testUser' },
      loginPassword: { value: 'password' },
      loginButton: { addEventListener: jest.fn((event, callback) => callback()) },
      registerButton: { addEventListener: jest.fn((event, callback) => callback()) },
      // Add other elements and their mock implementations as necessary
    };
    return elements[id] || { addEventListener: jest.fn(), click: jest.fn() };
  });

  document.querySelector = jest.fn().mockImplementation((selector) => {
    if (selector === '.wrapper') {
      return {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          toggle: jest.fn()
        },
        // Add other properties and methods as needed
      };
    } else if (selector === 'input[name="userType"]:checked') {
      return { value: 'Customer' }; // or 'Admin', based on the test case
    } else if (selector === '.close' || selector === '.btnLogin-popup' || selector === '.btnRegister-popup') {
      return { addEventListener: jest.fn() };
    }
    // Mock other selectors as needed
    return { addEventListener: jest.fn() };
  });

  // Re-import script.js for each test to ensure a fresh environment
  jest.isolateModules(() => {
    require('./script.js');
  });
});

// Tests for script.js
describe('script.js tests', () => {
  test('loginUser is called when login button is clicked', () => {
    // Mock necessary DOM elements before importing the script
    document.querySelector = jest.fn().mockReturnValue({
      classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
    });

    document.getElementById = jest.fn().mockImplementation((id) => {
      switch (id) {
        case 'loginUsername': return { value: 'testUser' }; // Assuming this is a valid user
        case 'loginPassword': return { value: 'correctPassword' }; // Assuming this is the correct password
        case 'loginButton': return { addEventListener: jest.fn((event, callback) => callback()) };
        default: return { addEventListener: jest.fn() };
      }
    });

    // Manually trigger the DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Call the loginUser function
    window.loginUser();

// Assertions to check if loginUser worked as expected
expect(window.alert).toHaveBeenCalledWith('Login Successful!');
expect(window.location.assign).toHaveBeenCalledWith('Success.html');
  });

  test('registerUser is called when register button is clicked', () => {
    // Mock necessary DOM elements before importing the script
    document.querySelector = jest.fn().mockReturnValue({
      classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
    });

    document.getElementById = jest.fn().mockImplementation((id) => {
      switch (id) {
        case 'registerUsername': return { value: 'newUser' };
        case 'registerPassword': return { value: 'newPassword' };
        case 'userType': return { value: 'Customer' }; // Ensure this element is correctly mocked
        case 'registerButton': return { addEventListener: jest.fn((event, callback) => callback()) };
        default: return { addEventListener: jest.fn() };
      }
    });
    // Manually trigger the DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Call the registerUser function
    window.registerUser();

    // Assertions to check if registerUser worked as expected
    expect(window.alert).toHaveBeenCalledWith('Registration Successful. You can now log in.');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'newUser',
      JSON.stringify({ username: 'newUser', password: 'newPassword', userType: 'Customer' })
    );
  });

  // Add more tests to cover additional functionality
});
