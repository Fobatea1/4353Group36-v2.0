const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'hey'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
});

app.post('/register', (req, res) => {
    const { username, password, userType, firstName, lastName } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Error processing your registration' });
        }
        const sql = 'INSERT INTO UserAccounts (Username, Password, AccountType, FirstName, LastName) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [username, hash, userType, firstName, lastName], (err, result) => {
            if (err) {
                console.error('Error during registration:', err);
                return res.status(500).json({ message: 'Error registering the user' });
            }
            res.json({ message: 'User registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT UserID, Password, AccountType FROM UserAccounts WHERE Username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (results.length > 0) {
            bcrypt.compare(password, results[0].Password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing password:', err);
                    return res.status(500).json({ message: 'Login failed' });
                }
                if (isMatch) {
                    res.json({ message: 'Login successful', userType: results[0].AccountType });
                } else {
                    res.json({ message: 'Invalid username or password' });
                }
            });
        } else {
            res.json({ message: 'Invalid username or password' });
        }
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT Username, AccountType FROM UserAccounts';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
