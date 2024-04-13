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
            res.status(500).send('Error fetching all users');
        } else {
            res.json(results);
        }
    });
});

app.post('/addFuelRequest', (req, res) => {
    const { userID, gallonsRequested, fuelType, totalAmountDue, deliveryAddress, deliveryCity, deliveryState, deliveryZipCode, deliveryDate } = req.body;

    const sql = 'INSERT INTO FuelHistory (UserID, GallonsRequested, FuelType, TotalAmountDue, DeliveryAddress, DeliveryCity, DeliveryState, DeliveryZipCode, DeliveryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [userID, gallonsRequested, fuelType, totalAmountDue, deliveryAddress, deliveryCity, deliveryState, deliveryZipCode, deliveryDate], (err, result) => {
        if (err) {
            console.error('Error adding fuel request:', err);
            return res.status(500).json({ message: 'Error adding fuel request' });
        }
        res.json({ message: 'Fuel request added successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
