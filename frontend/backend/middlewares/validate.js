const Joi = require('joi');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const schemas = {
    register: Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is required'
        }),
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).pattern(passwordRegex).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one number, and one special character',
            'any.required': 'Password is required'
        }),
        role: Joi.string().valid('customer', 'admin').default('customer').messages({
            'any.only': 'Role must be either customer or admin'
        })
    }),

    login: Joi.object({
        email: Joi.string().trim().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required'
        })
    }),

    product: Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': 'Product name cannot be empty',
            'any.required': 'Product name is required'
        }),
        description: Joi.string().trim().required().messages({
            'string.empty': 'Product description cannot be empty',
            'any.required': 'Product description is required'
        }),
        price: Joi.number().min(0).required().messages({
            'number.min': 'Price cannot be negative',
            'any.required': 'Product price is required'
        }),
        imageUrl: Joi.string().trim().uri().required().messages({
            'string.uri': 'Please provide a valid image URL',
            'any.required': 'Product image URL is required'
        }),
        category: Joi.string().trim().required().messages({
            'string.empty': 'Product category cannot be empty',
            'any.required': 'Product category is required'
        }),
        stock: Joi.number().integer().min(0).required().messages({
            'number.min': 'Stock cannot be negative',
            'any.required': 'Product stock is required'
        })
    }),

    addToCart: Joi.object({
        productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
            'string.pattern.base': 'Invalid Product ID format',
            'any.required': 'Product ID is required'
        }),
        quantity: Joi.number().integer().min(1).default(1).messages({
            'number.min': 'Quantity must be at least 1'
        })
    })
};

const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({ success: false, message: `Validation schema "${schemaName}" not found` });
        }

        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMessages
            });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    validateRequest
};
