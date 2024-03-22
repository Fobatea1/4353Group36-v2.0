// script.test.js

const { loginUser, registerUser } = require('./script');

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

  // Setup the mock for redirectTo on window object
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

  // Additional tests for UI interactions would go here
});
