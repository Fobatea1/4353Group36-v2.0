const { loginUser, registerUser } = require('./script');

beforeEach(() => {
  jest.clearAllMocks();

  global.alert = jest.fn();
  global.location = { assign: jest.fn() };

  const mockUser = JSON.stringify({
    username: 'testUser',
    password: 'correctPassword',
    userType: 'Customer'
  });

  // Reset localStorage mock with a more targeted approach
  global.localStorage = {
    getItem: jest.fn((key) => key === 'testUser' ? mockUser : null),
    setItem: jest.fn(),
    // Ensure setItem is recognized as a Jest spy
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  document.getElementById = jest.fn((id) => {
    switch (id) {
      case 'loginUsername': return { value: 'testUser' };
      case 'loginPassword': return { value: 'correctPassword' };
      case 'registerUsername': return { value: 'newUser' };
      case 'registerPassword': return { value: 'anyPassword' };
      default: return null;
    }
  });

  document.querySelector = jest.fn((selector) => {
    if (selector === 'input[name="userType"]:checked') {
      return { value: 'Customer' };
    }
    // Mock .wrapper for registration test
    if (selector === '.wrapper') {
      return { classList: { remove: jest.fn() } };
    }
    return null;
  });
});

describe('User Interaction Tests', () => {
  test('Successful login', async () => {
    await loginUser();
    expect(alert).toHaveBeenCalledWith('Login Successful!');
    expect(location.assign).toHaveBeenCalledWith(expect.stringContaining('Success.html'));
  });

  test('Successful registration', async () => {
    const mockEvent = { preventDefault: jest.fn() };
    await registerUser(mockEvent);
    expect(alert).toHaveBeenCalledWith('Registration Successful. You can now log in.');
    expect(global.localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});