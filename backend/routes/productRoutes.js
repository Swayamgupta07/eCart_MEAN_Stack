const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getCategories
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validate');

router.get('/categories', getCategories);

router.route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), validateRequest('product'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('admin'), validateRequest('product'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
