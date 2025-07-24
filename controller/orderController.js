const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


// @desc   Place Order (Checkout)
const placeOrder = async (req, res) => {
    try {
        console.log('Placing order for user:', req.user._id);
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalPrice = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        const order = await Order.create({
            user: req.user._id,
            orderItems: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalPrice,
            paymentMethod: 'Cash on Delivery'
        });

        await Cart.findOneAndDelete({ user: req.user._id });

        // Reduce stock for each product ordered
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                if (product.stock < 0) product.stock = 0;
                await product.save();
            }
        }

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Get User's Orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    placeOrder,
    getMyOrders
};