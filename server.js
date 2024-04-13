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
    const { username, password, userType } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Error processing your registration' });
        }
        const sql = 'INSERT INTO UserAccounts (Username, Password, AccountType) VALUES (?, ?, ?)';
        db.query(sql, [username, hash, userType], (err, result) => {
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

app.post('/addHistory', (req, res) => {
    const { userID, gallonsRequested, fuelType, totalAmountDue, deliveryAddress, deliveryDate } = req.body;
    const sql = `INSERT INTO FuelHistory (UserID, GallonsRequested, FuelType, TotalAmountDue, DeliveryAddress, DeliveryDate)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [userID, gallonsRequested, fuelType, totalAmountDue, deliveryAddress, deliveryDate], (err, result) => {
        if (err) {
            console.error('Error inserting fuel history:', err);
            return res.status(500).json({ message: 'Error adding fuel history' });
        }
        res.json({ message: 'Fuel history added successfully' });
    });
});

app.delete('/clearHistory', (req, res) => {
    const { userID } = req.body; // Assuming the userID is sent in the request body
    const sql = 'DELETE FROM FuelHistory WHERE UserID = ?';

    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.error('Error clearing history:', err);
            return res.status(500).json({ message: 'Error clearing history' });
        }
        res.json({ message: 'History cleared successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
