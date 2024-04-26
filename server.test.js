const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('./server'); // Assuming server.js is in the same directory

describe('POST /register', () => {
    it('registers a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'testpassword',
                userType: 'customer',
                firstName: 'Test',
                lastName: 'User'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
});

describe('POST /login', () => {
    it('logs in an existing user', async () => {
        const hashedPassword = await bcrypt.hash('testpassword', 10);
        // Assuming testuser is already registered
        await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: hashedPassword,
                userType: 'customer',
                firstName: 'Test',
                lastName: 'User'
            });

        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'testpassword'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userID');
    });
});

describe('GET /userInfo/:username', () => {
    it('returns user information', async () => {
        const res = await request(app)
            .get('/userInfo/testuser');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('FirstName', 'Test');
        expect(res.body).toHaveProperty('LastName', 'User');
        expect(res.body).toHaveProperty('Address');
        expect(res.body).toHaveProperty('City');
        expect(res.body).toHaveProperty('State');
        expect(res.body).toHaveProperty('ZipCode');
        expect(res.body).toHaveProperty('AccountType');
    });
});

describe('PUT /userInfo/:username', () => {
    it('updates user information', async () => {
        const res = await request(app)
            .put('/userInfo/testuser')
            .send({
                FirstName: 'Updated',
                LastName: 'User',
                Address: 'Updated Address',
                City: 'Updated City',
                State: 'Updated State',
                ZipCode: 'Updated ZipCode'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User information updated successfully');
    });
});

describe('GET /allUsers', () => {
    it('returns all users', async () => {
        const res = await request(app)
            .get('/allUsers');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach(user => {
            expect(user).toHaveProperty('Username');
            expect(user).toHaveProperty('AccountType');
        });
    });
});

describe('POST /addFuelHistory', () => {
    it('adds fuel history for a user', async () => {
        // Assuming the user is authenticated and token is provided
        const token = jwt.sign({ userID: 'testuser' }, 'your_secret_key');
        const res = await request(app)
            .post('/addFuelHistory')
            .set('Authorization', `Bearer ${token}`)
            .send({
                GallonsRequested: 10,
                FuelType: 'Type - $2/gallon',
                DeliveryAddress: 'Test Address',
                DeliveryCity: 'Test City',
                DeliveryState: 'Test State',
                DeliveryZipCode: '12345',
                DeliveryDate: '2024-04-25'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Fuel history added successfully');
    });
});

describe('GET /getFuelHistory/:username', () => {
    it('returns fuel history for a user', async () => {
        // Assuming the user has fuel history
        const res = await request(app)
            .get('/getFuelHistory/testuser');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach(history => {
            expect(history).toHaveProperty('FuelID');
            expect(history).toHaveProperty('UserID');
            expect(history).toHaveProperty('GallonsRequested');
            expect(history).toHaveProperty('FuelType');
            expect(history).toHaveProperty('TotalAmountDue');
            expect(history).toHaveProperty('DeliveryAddress');
            expect(history).toHaveProperty('DeliveryCity');
            expect(history).toHaveProperty('DeliveryState');
            expect(history).toHaveProperty('DeliveryZipCode');
            expect(history).toHaveProperty('DeliveryDate');
        });
    });
});

// Cleanup after tests
afterAll(async () => {
    // Clear test user from the database
    await request(app)
        .delete('/clearFuelHistory/testuser');
});