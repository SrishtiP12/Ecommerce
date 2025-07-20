const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add a product to the cart
const addToCart = async (req, res) => {
    try {
        console.log('Add to Cart route hit');
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            cart = await cart.save();
            console.log('Cart updated:', cart);
        } else {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }]
            });
            console.log('New cart created:', cart);
        }
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getCart = async (req, res) => {
    try {
        console.log('Get Cart route hit');
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(200).json({ message: 'Cart is empty', items: [] });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        console.log('Remove from Cart route hit');
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();

        res.status(200).json({ message: 'Item removed', cart });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Clear cart
const clearCart = async (req, res) => {
    try {
        console.log('Clear Cart route hit');
        await Cart.findOneAndDelete({ user: req.user._id });

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error in clearCart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};