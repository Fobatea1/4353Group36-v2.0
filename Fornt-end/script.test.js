// script.test.js

const { loginUser, registerUser, redirectTo } = require('./script');

beforeEach(() => {
  jest.clearAllMocks();

  // Setup the mock for localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key) => {
        // Make sure to return a JSON string for valid users and null otherwise
        if (key === 'testUser') {
          return JSON.stringify({
            username: 'testUser',
            password: 'correctPassword',
            userType: 'Customer'
          });
        }
        return null;
      }),
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
    return { value: id === 'loginUsername' ? 'testUser' : 'wrongPassword' };
  });

  // Mock document.querySelector for any other DOM queries
  document.querySelector = jest.fn((selector) => {
    const mockElements = {
      '.wrapper': { classList: { add: jest.fn(), remove: jest.fn() } },
      '.login-link': { addEventListener: jest.fn((event, handler) => handler()) },
      '.register-link': { addEventListener: jest.fn((event, handler) => handler()) },
      '.btnLogin-popup': { addEventListener: jest.fn((event, handler) => handler()) },
      '.btnRegister-popup': { addEventListener: jest.fn((event, handler) => handler()) },
      '.icon-close': { addEventListener: jest.fn((event, handler) => handler()) },
      'input[name="userType"]:checked': { value: 'Customer' }
    };
    return mockElements[selector] || null;
  });
});

// Test suite for user interactions
describe('User Interaction Tests', () => {
  test('Successful login', () => {
    loginUser();
    expect(alert).toHaveBeenCalledWith('Login Successful!');
    expect(redirectTo).toHaveBeenCalledWith(expect.stringContaining('Success.html'));
  });

  test('Unsuccessful login', () => {
    document.getElementById.mockImplementation((id) => {
      if (id === 'loginUsername') return { value: 'wrongUser' };
      return { value: 'wrongPassword' };
    });
    loginUser();
    expect(alert).toHaveBeenCalledWith('Invalid Username or Password.');
    expect(redirectTo).not.toHaveBeenCalled();
  });

  test('Successful registration', () => {
    const mockEvent = { preventDefault: jest.fn() };
    registerUser(mockEvent);
    expect(alert).toHaveBeenCalledWith('Registration Successful. You can now log in.');
    expect(localStorage.setItem).toHaveBeenCalledWith(
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

    redirectTo('http://example.com');
    expect(window.location.href).toBe('http://example.com');

    // Restore window.location
    delete window.location;
    window.location = document.createElement('a');
  });
});

// Test suite for DOMContentLoaded event listeners
describe('DOMContentLoaded event listeners', () => {
  test('should attach listeners and modify classes correctly', () => {
    // Trigger DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Simulate events to test class list modifications
    expect(document.querySelector('.register-link').addEventListener)
      .toHaveBeenCalledWith('click', expect.any(Function));
    expect(document.querySelector('.login-link').addEventListener)
      .toHaveBeenCalledWith('click', expect.any(Function));
    expect(document.querySelector('.btnLogin-popup').addEventListener)
      .toHaveBeenCalledWith('click', expect.any(Function));
    expect(document.querySelector('.icon-close').addEventListener)
      .toHaveBeenCalledWith('click', expect.any(Function));
    expect(document.querySelector('.btnRegister-popup').addEventListener)
      .toHaveBeenCalledWith('click', expect.any(Function));

    // Since the handlers are called immediately upon adding the event listener due to the mock setup,
    // there is no need to manually invoke the handlers in this test.
  });
});
