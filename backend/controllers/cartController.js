const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [], saveForLater: [] });
    }
    return cart;
};

exports.getCart = async (req, res, next) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        await cart.populate('items.product saveForLater.product');
        
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const qty = quantity || 1;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const cart = await getOrCreateCart(req.user._id);

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        let newQuantity = qty;

        if (itemIndex > -1) {
            newQuantity = cart.items[itemIndex].quantity + qty;
        }

        if (newQuantity > productExists.stock) {
            return res.status(400).json({ success: false, message: `Cannot add to cart. Only ${productExists.stock} items left in stock.` });
        }

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity: newQuantity });
        }

        cart.saveForLater = cart.saveForLater.filter(item => item.product.toString() !== productId);

        await cart.save();
        await cart.populate('items.product saveForLater.product');

        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart
        });
    } catch (error) {
        next(error);
    }
};

exports.saveForLater = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await getOrCreateCart(req.user._id);

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(400).json({ success: false, message: 'Item not found in your cart' });
        }

        cart.items.splice(itemIndex, 1);

        const savedIndex = cart.saveForLater.findIndex(item => item.product.toString() === productId);
        if (savedIndex === -1) {
            cart.saveForLater.push({ product: productId });
        }

        await cart.save();
        await cart.populate('items.product saveForLater.product');

        res.status(200).json({
            success: true,
            message: 'Product moved to Save For Later list',
            cart
        });
    } catch (error) {
        next(error);
    }
};

exports.moveToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await getOrCreateCart(req.user._id);

        const savedIndex = cart.saveForLater.findIndex(item => item.product.toString() === productId);

        if (savedIndex === -1) {
            return res.status(400).json({ success: false, message: 'Item not found in Save For Later list' });
        }

        cart.saveForLater.splice(savedIndex, 1);

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        await cart.populate('items.product saveForLater.product');

        res.status(200).json({
            success: true,
            message: 'Product moved to active cart',
            cart
        });
    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await getOrCreateCart(req.user._id);

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.saveForLater = cart.saveForLater.filter(item => item.product.toString() !== productId);

        await cart.save();
        await cart.populate('items.product saveForLater.product');

        res.status(200).json({
            success: true,
            message: 'Product removed from cart/saved items',
            cart
        });
    } catch (error) {
        next(error);
    }
};
