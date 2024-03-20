// HistoryManager.test.js

const HistoryManager = require('./HistoryManager');

describe('History Management', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem('username', 'testUser');
    });

    it('adds and retrieves history', () => {
        const entry = { test: 'data' };
        HistoryManager.addEntry(entry);
        expect(HistoryManager.getHistory()).toContainEqual(entry);
    });

    it('clears history', () => {
        HistoryManager.addEntry({ test: 'data' });
        HistoryManager.clearHistory();
        expect(HistoryManager.getHistory()).toEqual([]);
    });
});