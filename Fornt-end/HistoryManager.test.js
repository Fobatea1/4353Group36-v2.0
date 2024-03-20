const HistoryManager = require('./HistoryManager');

describe('History Management', () => {
    let mockStorage;
    let mockSession;
    let historyManager;

    beforeEach(() => {
        mockStorage = (() => {
            let store = {};
            return {
                getItem: jest.fn((key) => store[key] || null),
                setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
                removeItem: jest.fn((key) => { delete store[key]; }),
                clear: jest.fn(() => { store = {}; }),
            };
        })();

        mockSession = {
            getItem: jest.fn().mockReturnValue('testUser'), // Mocking a logged-in user
        };

        historyManager = new HistoryManager(mockStorage, mockSession);
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
});
