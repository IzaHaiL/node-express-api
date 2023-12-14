  var express = require('express');
  var router = express.Router();
  var userControllers = require('../controllers/userControllers'); // Correct the file path
  var { authenticateToken, authenticateRefreshToken, checkBlacklist , isAdmin,isUserOwner  } = require('../middlewares/auth');



  // GET all users
  router.get('/', authenticateToken, authenticateRefreshToken, isAdmin, checkBlacklist, checkBlacklist, userControllers.getAllUsers);

  // GET user detail
  router.get('/:id', authenticateToken, authenticateRefreshToken, isUserOwner, checkBlacklist, userControllers.getUserDetail);
  // POST user sign in
  router.post('/signin', userControllers.signIn);

  // POST user sign out
  router.post('/signout',  authenticateToken, authenticateRefreshToken, checkBlacklist , checkBlacklist, userControllers.signOut);

  // POST user sign up
  router.post('/signup', userControllers.signUp);


  // PUT update user
  router.put('/:id', authenticateToken, authenticateRefreshToken, isUserOwner, checkBlacklist, userControllers.updateUser);

  // DELETE delete user
  router.delete('/:id', authenticateToken, authenticateRefreshToken, isAdmin, checkBlacklist, userControllers.deleteUser);

  module.exports = router;
