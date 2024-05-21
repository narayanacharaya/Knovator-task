const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const postController = require('../controller/postController');
const passport = require('passport');

// Load Passport configuration
require('../config/passport');

// Use Passport to authenticate JWT tokens
const authenticate = passport.authenticate('jwt', { session: false });

router.post(
  '/',
  [
    authenticate,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('body', 'Body is required').not().isEmpty(),
      body('geoLocation.latitude', 'Latitude is required').isNumeric(),
      body('geoLocation.longitude', 'Longitude is required').isNumeric(),
    ],
  ],
  postController.createPost
);

router.get('/', authenticate, postController.getPosts);

router.put(
  '/:id',
  [
    authenticate,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('body', 'Body is required').not().isEmpty(),
      body('geoLocation.latitude', 'Latitude is required').isNumeric(),
      body('geoLocation.longitude', 'Longitude is required').isNumeric(),
      param('id', 'Invalid post ID').isMongoId(),
    ],
  ],
  postController.updatePost
);

router.delete('/:id', authenticate, postController.deletePost);
router.get('/location', authenticate, postController.getPostsByLocation);
router.get('/counts', authenticate, postController.getPostCounts);

module.exports = router;
