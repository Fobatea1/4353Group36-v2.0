const HistoryManager = require('./HistoryManager');

describe('History Management', () => {
    let mockStorage;
    let mockSession;
    let historyManager;

    beforeEach(() => {
        mockStorage = {
            getItem: jest.fn((key) => mockStorage[key] || null),
            setItem: jest.fn((key, value) => { mockStorage[key] = value.toString(); }),
            removeItem: jest.fn((key) => { delete mockStorage[key]; }),
            clear: jest.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }),
        };

        mockSession = {
            getItem: jest.fn().mockReturnValue('testUser'), // Mocking a logged-in user
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        };

        historyManager = new HistoryManager(mockStorage, mockSession);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('adds and retrieves history correctly', () => {
        const entry = { date: '2021-01-01', amount: 100 };
        historyManager.addEntry(entry);

        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'fuelRequestHistory_testUser',
            JSON.stringify([entry])
        );

        const history = historyManager.getHistory();
        expect(history).toEqual([entry]);
    });

    it('clears history for the current user', () => {
        historyManager.addEntry({ date: '2021-01-01', amount: 100 });
        historyManager.clearHistory();

        expect(mockStorage.removeItem).toHaveBeenCalledWith('fuelRequestHistory_testUser');
        expect(historyManager.getHistory()).toEqual([]);
    });

    it('initializes with default storage and session when not provided', () => {
        // This test is somewhat conceptual in a Node environment, as it's meant to ensure
        // that the constructor works with defaults, even though we can't use window.localStorage/sessionStorage directly here.
        expect(() => new HistoryManager()).not.toThrow();
    });

});
