var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/userControllers'); // Correct the file path



// GET all users
router.get('/', userControllers.getAllUsers);

// GET user detail
router.get('/:id', userControllers.getUserDetail);

// POST create a new user (Sign up)
router.post('/', userControllers.signUp);

// POST user sign in
router.post('/signin', userControllers.signIn);

// POST user sign out
router.post('/signout', userControllers.signOut);

// POST user sing up
router.post('/signup', userControllers.signUp);

// PUT update user
router.put('/:id', userControllers.updateUser);

// DELETE delete user
router.delete('/:id', userControllers.deleteUser);

module.exports = router;
