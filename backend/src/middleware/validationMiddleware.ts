import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Example: User Registration Validation
export const registerUserValidationRules = (): ValidationChain[] => {
  return [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) // Example: more complex password
      // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
  ];
};

// Example: Product Creation Validation
export const createProductValidationRules = (): ValidationChain[] => {
  return [
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim().escape(),
    body('price').isNumeric().withMessage('Price must be a number').toFloat(),
    body('condition').isIn(['new', 'excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
    body('category').notEmpty().withMessage('Category is required').trim().escape(),
    // Add more rules as needed for images, location etc.
  ];
};

// Add more validation rule sets here for other routes as needed
