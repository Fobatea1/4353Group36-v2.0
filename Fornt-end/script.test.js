const { loginUser, registerUser } = require('./script');

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Setup the mock for localStorage with Jest mock functions
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

  // Mock global alert and location.assign
  global.alert = jest.fn();
  global.location = { assign: jest.fn() };

  // Mock document.getElementById to simulate form inputs
  document.getElementById = jest.fn().mockImplementation((id) => {
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

  // Mock document.querySelector for other DOM manipulations
  document.querySelector = jest.fn().mockImplementation((selector) => {
    if (selector === '.wrapper') {
      // Return an object with a mock classList for '.wrapper'
      return { classList: { remove: jest.fn() } };
    } else if (selector === 'input[name="userType"]:checked') {
      // Mock the checked userType input
      return { value: 'Customer' };
    }
    return null;
  });
});

describe('User Interaction Tests', () => {
  test('Successful login', async () => {
    await loginUser();
    // Verify alert was called with "Login Successful!"
    expect(alert).toHaveBeenCalledWith('Login Successful!');
    // Verify location.assign was called with a URL containing 'Success.html'
    expect(location.assign).toHaveBeenCalledWith(expect.stringContaining('Success.html'));
  });

  test('Successful registration', async () => {
    const mockEvent = { preventDefault: jest.fn() };
    await registerUser(mockEvent);
    // Verify alert was called with "Registration Successful. You can now log in."
    expect(alert).toHaveBeenCalledWith('Registration Successful. You can now log in.');
    // Verify localStorage.setItem was called once
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
