const Post = require('../model/Post');
const { validationResult } = require('express-validator');

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, body, isActive, geoLocation } = req.body;

  try {
    const post = new Post({
      title,
      body,
      createdBy: req.user.id,
      isActive,
      geoLocation,
    });

    const newPost = await post.save();
    res.json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user.id });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, body, isActive, geoLocation } = req.body;

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { title, body, isActive, geoLocation } },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Post.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByLocation = async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const posts = await Post.find({
      'geoLocation.latitude': latitude,
      'geoLocation.longitude': longitude,
    });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostCounts = async (req, res) => {
  try {
    const activeCount = await Post.countDocuments({
      isActive: true,
      createdBy: req.user.id,
    });
    const inactiveCount = await Post.countDocuments({
      isActive: false,
      createdBy: req.user.id,
    });

    res.json({ active: activeCount, inactive: inactiveCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
