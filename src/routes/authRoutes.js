const express = require('express');
const { body } = require('express-validator');
const authController = require('../controller/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

module.exports = router;
