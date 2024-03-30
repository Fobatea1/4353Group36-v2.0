// script.test.js

const { loginUser, registerUser, redirectTo } = require('./script');

beforeEach(() => {
  jest.clearAllMocks();

  // Setup the mock for localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    configurable: true
  });

  // Mock the alert function
  global.alert = jest.fn();

  // Setup the mock for redirectTo on the window object
  window.redirectTo = jest.fn();

  // Mock document.getElementById for form inputs
  document.getElementById = jest.fn((id) => {
    switch (id) {
      case 'loginUsername':
        return { value: 'testUser' };
      case 'loginPassword':
        return { value: 'correctPassword' };
      case 'registerUsername':
        return { value: 'newUser' };
      case 'registerPassword':
        return { value: 'newPassword' };
      default:
        return null;
    }
  });

  // Mock document.querySelector for any other DOM queries
  document.querySelector = jest.fn((selector) => {
    const mockElements = {
      '.wrapper': { classList: { add: jest.fn(), remove: jest.fn() } },
      '.login-link': { addEventListener: jest.fn() },
      '.register-link': { addEventListener: jest.fn() },
      '.btnLogin-popup': { addEventListener: jest.fn() },
      '.btnRegister-popup': { addEventListener: jest.fn() },
      '.icon-close': { addEventListener: jest.fn() },
      'input[name="userType"]:checked': { value: 'Customer' }
    };
    return mockElements[selector] || null;
  });
});

// Test suite for user interactions
describe('User Interaction Tests', () => {
  test('Successful login', () => {
    window.loginUser();
    expect(alert).toHaveBeenCalledWith('Login Successful!');
    expect(window.redirectTo).toHaveBeenCalledWith(expect.stringContaining('Success.html'));
  });

  test('Unsuccessful login', () => {
    document.getElementById.mockImplementation((id) => {
      if (id === 'loginUsername') return { value: 'wrongUser' };
      if (id === 'loginPassword') return { value: 'wrongPassword' };
      return null;
    });

    window.loginUser();
    expect(alert).toHaveBeenCalledWith('Invalid Username or Password.');
    expect(window.redirectTo).not.toHaveBeenCalled();
  });

  test('Successful registration', () => {
    const mockEvent = { preventDefault: jest.fn() };
    window.registerUser(mockEvent);

    expect(alert).toHaveBeenCalledWith('Registration Successful. You can now log in.');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'newUser',
      JSON.stringify({
        username: 'newUser',
        password: 'newPassword',
        userType: 'Customer'
      })
    );
  });
});

// Test suite for the redirectTo function
describe('Window redirectTo function', () => {
  test('should change window location href', () => {
    // Mock window.location with an object to capture href changes
    delete window.location;
    window.location = { href: '' };

    const testUrl = 'http://example.com';
    redirectTo(testUrl);

    expect(window.location.href).toBe(testUrl);

    // Restore window.location
    delete window.location;
    window.location = Object.assign(document.createElement('a'), { href: '' });
  });
});

// Test suite for DOMContentLoaded event listeners
describe('DOMContentLoaded event listeners', () => {
  test('should attach listeners and modify classes correctly', () => {
    // Trigger DOMContentLoaded event
    const domContentLoadedEvent = new Event('DOMContentLoaded');
    document.dispatchEvent(domContentLoadedEvent);

    // Simulate events to test class list modifications
    document.querySelector('.register-link').addEventListener.mock.calls[0][1](); // Simulate register link click
    document.querySelector('.login-link').addEventListener.mock.calls[0][1](); // Simulate login link click
    document.querySelector('.btnLogin-popup').addEventListener.mock.calls[0][1](); // Simulate login popup button click
    document.querySelector('.icon-close').addEventListener.mock.calls[0][1](); // Simulate close icon click
    document.querySelector('.btnRegister-popup').addEventListener.mock.calls[0][1](); // Simulate register popup button click

    // Assertions for classList method calls
    expect(document.querySelector('.wrapper').classList.add).toHaveBeenCalledWith('active'); // For register link
    expect(document.querySelector('.wrapper').classList.remove).toHaveBeenCalledWith('active'); // For login link
    expect(document.querySelector('.wrapper').classList.add).toHaveBeenCalledWith('active-popup'); // For login popup
    expect(document.querySelector('.wrapper').classList.remove).toHaveBeenCalledWith('active'); // For login popup
    expect(document.querySelector('.wrapper').classList.remove).toHaveBeenCalledWith('active-popup'); // For close icon
    expect(document.querySelector('.wrapper').classList.add).toHaveBeenCalledWith('active-popup'); // For register popup
    expect(document.querySelector('.wrapper').classList.add).toHaveBeenCalledWith('active'); // For register popup
  });
});

// The below line is needed if you are using CommonJS syntax and exporting your functions for testing
module.exports = { loginUser, registerUser, redirectTo };
