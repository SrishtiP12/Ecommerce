const express = require('express');
const app = express();
const User = require('../models/userModel'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');
const router = express.Router();





// Creating a new user 
router.post('/register', async (req, res) => {
    try {
         console.log('Register route hit'); 
        const { name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name, 
            email,
            password: HashedPassword,
        });
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'User registered successfully'
            
        });

    }catch (error) {
        console.error('Error in Register Route:', error);  
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async(req, res) =>{
    try {
        console.log('login route hit'); 
        const{ email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'User logged in successfully'
        });

    }catch (error) {
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;    
// Export the router