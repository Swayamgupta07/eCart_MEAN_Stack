const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.checkout = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty' });
        }

        let totalAmount = 0;
        let orderItems = [];

        // Validate stock and prepare order items
        for (let item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product || product.IsActive === false) {
                return res.status(400).json({ success: false, message: `Product ${item.product.name} is no longer available` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}. Only ${product.stock} items left.` });
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
            totalAmount += product.price * item.quantity;
        }

        // Deduct stock
        for (let item of cart.items) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }

        // Create Order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            CreatedBy: req.user._id,
            ModifiedBy: req.user._id
        });

        // Clear active cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        order.ModifiedBy = req.user._id;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        next(error);
    }
};
