const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const saltRounds = 10;
const secretKey = 'your_secret_key';

const corsOptions = {
    origin: 'http://127.0.0.1:5502', // Adjust if necessary
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

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
    const sql = 'SELECT UserID, Password FROM UserAccounts WHERE Username = ?';
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
                    const token = jwt.sign({ userID: results[0].UserID }, secretKey, { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    res.json({ message: 'Login successful' });
                } else {
                    res.json({ message: 'Invalid username or password' });
                }
            });
        } else {
            res.json({ message: 'Invalid username or password' });
        }
    });
});

app.get('/userInfo/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'SELECT FirstName, LastName, Address, City, State, ZipCode FROM UserAccounts WHERE Username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ message: 'Error fetching user information' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

app.put('/userInfo/:username', (req, res) => {
    const { firstName, lastName, address, city, state, zipCode } = req.body;
    const username = req.params.username;
    const sql = 'UPDATE UserAccounts SET FirstName = ?, LastName = ?, Address = ?, City = ?, State = ?, ZipCode = ? WHERE Username = ?';
    db.query(sql, [firstName, lastName, address, city, state, zipCode, username], (err, result) => {
        if (err) {
            console.error('Error updating user info:', err);
            return res.status(500).json({ message: 'Error updating user information' });
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'User information updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

app.get('/allUsers', (req, res) => {
    db.query('SELECT Username, AccountType FROM UserAccounts', (err, results) => {
        if (err) {
            console.error('Error fetching all users:', err);
            return res.status(500).json({ message: 'Error fetching all users' });
        }
        res.json(results);
    });
});

app.post('/addFuelHistory', (req, res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, secretKey);
        const userID = decoded.userID;
        const { GallonsRequested, FuelType, TotalAmountDue, DeliveryAddress, DeliveryCity, DeliveryState, DeliveryZipCode, DeliveryDate } = req.body;
        const sql = 'INSERT INTO FuelHistory (UserID, GallonsRequested, Fuel Type, Total AmountDue, DeliveryAddress, DeliveryCity, Delivery State, DeliveryZipCode, DeliveryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [userID, GallonsRequested, FuelType, TotalAmountDue, DeliveryAddress, DeliveryCity, DeliveryState, DeliveryZipCode, DeliveryDate], (err, result) => {
            if (err) {
                console.error('Error adding fuel history:', err);
                return res.status(500).json({ message: 'Error adding fuel history' });
            }
            res.json({ message: 'Fuel history added successfully' });
        });
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

app.get('/getFuelHistory/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'SELECT * FROM FuelHistory JOIN UserAccounts ON FuelHistory.UserID = UserAccounts.UserID WHERE UserAccounts.Username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching fuel history:', err);
            return res.status(500).json({ message: 'Error fetching fuel history' });
        }
        res.json(results);
    });
});

app.delete('/clearFuelHistory/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'DELETE FROM FuelHistory WHERE UserID = (SELECT UserID FROM UserAccounts WHERE Username = ?)';
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error clearing fuel history:', err);
            return res.status(500).json({ message: 'Error clearing fuel history' });
        }
        res.json({ message: 'Fuel history cleared successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
