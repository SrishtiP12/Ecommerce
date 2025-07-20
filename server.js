const express = require('express');
const connectDb = require('./config/db'); // Adjust the path as necessary
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoute'); // Adjust the path as necessary

dotenv.config(); // Load environment variables
connectDb(); // Connect to MongoDB


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api/users', userRoutes); // Use user routes

const { googleLogin } = require('../controller/userController');
router.post('/google-login', googleLogin);

const productRoutes = require('./routes/productRoute');
app.use('/api/products', productRoutes);
// Use product routes

const cartRoutes = require('./routes/cartRoute');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/orderRoute');
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

const PORT = process.env.PORT || 5000; 
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});