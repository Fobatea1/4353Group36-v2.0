const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'hey'
});

// Attempt to connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if unable to connect
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
            return res.status(500).json({ message: 'Error registering the user' });
        }
        res.json({ message: 'User registered successfully' });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT Username, AccountType FROM UserAccounts WHERE Username = ? AND Password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (results.length > 0) {
            res.json({ message: 'Login successful', userType: results[0].AccountType });
        } else {
            res.json({ message: 'Invalid username or password' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
