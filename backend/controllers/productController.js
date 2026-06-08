const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        const { category } = req.query;
        let query = { IsActive: { $ne: false } };
        
        if (category) {
            query.category = { $regex: new RegExp('^' + category + '$', 'i') };
        }

        const products = await Product.find(query);
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, imageUrl, category, stock } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            imageUrl,
            category,
            stock,
            CreatedBy: req.user._id,
            ModifiedBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        req.body.ModifiedBy = req.user._id;

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.IsActive = false;
        product.ModifiedBy = req.user._id;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        next(error);
    }
};
