const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const EmployeeModel = require("./models/employee");
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/employee");

app.post('/signup', async (req, res) => {
    try {
        const employee = await EmployeeModel.create(req.body);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await EmployeeModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        
        // Generate JWT token upon successful authentication
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }); // Adjust expiresIn as needed
        console.log('Generated JWT Token:', token);
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
});

app.listen(3000, () => {
    console.log("Local server is running");
});
