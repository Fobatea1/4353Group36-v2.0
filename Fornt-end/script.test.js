const { loginUser, registerUser } = require('./script');

beforeAll(() => {
  // Mocking alert and location.assign
  global.alert = jest.fn();
  delete global.location;
  global.location = { assign: jest.fn() };

  // Mocking localStorage and sessionStorage
  const mockGetItem = jest.fn((key) => {
    if (key === 'testUser') {
      return JSON.stringify({ username: 'testUser', password: 'correctPassword', userType: 'Customer' });
    }
    return null;
  });
  
  global.localStorage = {
    getItem: mockGetItem,
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();

  document.getElementById = jest.fn().mockImplementation((id) => {
    switch (id) {
      case 'loginUsername': return { value: 'testUser' };
      case 'loginPassword': return { value: 'correctPassword' };
      case 'registerUsername': return { value: 'newUser' };
      case 'registerPassword': return { value: 'newPassword' };
      default: return null;
    }
  });

  document.querySelector = jest.fn().mockImplementation((selector) => {
    if (selector === '.wrapper') {
      return { classList: { add: jest.fn(), remove: jest.fn() } };
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
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
