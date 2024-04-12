const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'hey'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password, userType } = req.body;
    const sql = 'INSERT INTO UserAccounts (Username, Password, AccountType) VALUES (?, ?, ?)';
    db.query(sql, [username, password, userType], (err, result) => {
        if (err) {
            console.error('Error during registration:', err);
            res.status(500).send('Error registering the user');
            return;
        }
        res.send('User registered successfully');
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT Username, AccountType FROM UserAccounts WHERE Username = ? AND Password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).send('Error logging in');
            return;
        }
        if (results.length > 0) {
            res.json({message: 'Login successful', userType: results[0].AccountType});
        } else {
            res.send('Invalid username or password');
        }
    });
});

// Fetch User History
app.get('/history/:key', (req, res) => {
    const historyKey = req.params.key;
    const sql = 'SELECT HistoryDetails FROM UserHistory WHERE HistoryKey = ?';
    db.query(sql, [historyKey], (err, results) => {
        if (err) {
            console.error('Error fetching history:', err);
            res.status(500).send('Error fetching history');
            return;
        }
        res.json(results);
    });
});

// Add History Entry
app.post('/addHistory', (req, res) => {
    const { key, entry } = req.body;
    const sql = 'INSERT INTO UserHistory (HistoryKey, HistoryDetails) VALUES (?, ?)';
    db.query(sql, [key, JSON.stringify(entry)], (err, result) => {
        if (err) {
            console.error('Error adding history entry:', err);
            res.status(500).send('Error adding history entry');
            return;
        }
        res.send('History entry added successfully');
    });
});

// Clear User History
app.delete('/clearHistory/:key', (req, res) => {
    const historyKey = req.params.key;
    const sql = 'DELETE FROM UserHistory WHERE HistoryKey = ?';
    db.query(sql, [historyKey], (err, result) => {
        if (err) {
            console.error('Error clearing history:', err);
            res.status(500).send('Error clearing history');
            return;
        }
        res.send('History cleared successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
