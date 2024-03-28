// script.test.js

const { loginUser, registerUser, redirectTo } = require('./script');

beforeEach(() => {
  jest.clearAllMocks();

  // Setup the mock for localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key) => {
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
  // Note: This mock will be replaced with the actual function for the specific test
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
  document.querySelector = jest.fn().mockImplementation((selector) => {
    if (selector === '.wrapper') {
      return { classList: { remove: jest.fn(), add: jest.fn() } };
    } else if (selector === 'input[name="userType"]:checked') {
      return { value: 'Customer' };
    }
    return null;
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
    // Setup to simulate wrong credentials
    document.getElementById.mockImplementation((id) => {
      if (id === 'loginUsername') return { value: 'wrongUser' };
      if (id === 'loginPassword') return { value: 'wrongPassword' };
      return null;
    });

    window.loginUser();
    expect(alert).toHaveBeenCalledWith('Invalid Username or Password.');
    // Check redirectTo was not called
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

// Test for the redirectTo function using the actual implementation
describe('Window redirectTo function', () => {
  test('should change window location href', () => {
    // Store the original window.location
    const originalLocation = window.location;

    // Define a setter on the location object to spy on href changes
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { set href(url) { this._href = url; } },
    });

    // Call the actual redirectTo function with a mock URL
    const testUrl = 'http://example.com';
    redirectTo(testUrl);

    // Check that the href was changed by the redirectTo function
    expect(window.location._href).toBe(testUrl);

    // Restore the original window.location
    window.location = originalLocation;
  });
});
