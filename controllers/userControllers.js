/* eslint-disable no-console */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { users } = require('../models');
const {
  generateAccessToken, clearToken, authData, isUserOwner, isAdmin,
} = require('../middlewares/auth');

// Sign up endpoint
async function signUp(req, res) {
  console.log('Entire Request Body:', req.body);
  const { usernames, email, password } = req.body;
  try {
    // Check if required fields are provided
    if (!usernames || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    // Check if a user with the provided email already exists
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    // Trim the password and then hash it
    const trimmedPassword = password.trim();
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    // Create a new user
    const newUser = await users.create({
      usernames,
      email,
      password: hashedPassword,
      // Add other fields as needed
    });
    // Uncomment code below if you want to generate access and refresh tokens
    // const accessToken = generateAccessToken(newUser);
    // const refreshToken = generateRefreshToken(newUser);

    return res.status(200).json({
      message: `Register user with usernames ${usernames} Success`,
      user: newUser,
      // accessToken,
      // refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Sign in endpoint
async function signIn(req, res) {
  const { usernames, password } = req.body;
  try {
    // Find the user by usernames
    const user = await users.findOne({ where: { usernames } });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    // Generate an access token
    const accessToken = generateAccessToken(user);
    // Include user information in the response
    const userResponse = {
      userId: user.id,
      usernames: user.usernames,
      email: user.email,
      role: user.role,
      // Add other user details as needed
    };
    res.status(200).json({ message: `Login User ID ${user.id} Success`, accessToken, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Sign out endpoint
async function signOut(req, res) {
  try {
    // For example, clear token on the client side and then add it to the blacklist
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // Check if the token is provided
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }
    // Check if the token is in the blacklist
    if (authData.blacklistedTokens.includes(token)) {
      return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
    }
    // Check if user information is available
    if (req.user && req.user.userId && req.user.usernames) {
      const { userId, usernames } = req.user;
      // Clear (blacklist) the token
      clearToken(token);

      res.status(200).json({ message: `Sign-out successful for user ID ${userId} Usernames ${usernames}`, userId, usernames });
    } else {
      res.status(401).json({ error: 'Unauthorized: User information not available' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get all users endpoint
async function getAllUsers(res) {
  try {
    const allUsers = await users.findAll();
    res.status(200).json({ message: 'Get All Users Success', allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get user detail endpoint
async function getUserDetail(req, res) {
  const userId = req.params.id;
  console.log('Entire Request Body:', userId);

  try {
    const user = await users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: `Get Detail ID ${userId} Success`, userDetail: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Update user endpoint
async function updateUser(req, res) {
  const userId = req.params.id;
  try {
    // Use the isUserOwner middleware to check if the authenticated user is the owner of the resourc
    isUserOwner(req, res, async () => {
      // Check if the request body contains the 'password' field
      if (req.body.password) {
        // Trim the password and then hash it
        const trimmedPassword = req.body.password.trim();
        req.body.password = await bcrypt.hash(trimmedPassword, 10);
      }

      // Exclude 'usernames' and 'role' from req.body to prevent updating them
      delete req.body.usernames;
      delete req.body.role;

      // Check if the request body contains the 'email' field
      if (req.body.email) {
        // Check if the provided email already exists in the database for another user
        const existingUser = await users.findOne({
          where: {
            email: req.body.email,
            id: { [Op.not]: userId }, // Exclude the current user's ID
          },
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists for another user' });
        }
      }

      const [updatedRowsCount] = await users.update(req.body, {
        where: { id: userId },
      });

      if (updatedRowsCount > 0) {
        // Fetch the updated user separately
        const updatedUser = await users.findByPk(userId);
        res.status(200).json({ message: `Update Success for user with ID ${userId}`, userUpdated: updatedUser });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Delete user endpoint
async function deleteUser(req, res) {
  const userIdToDelete = req.params.id;

  try {
    // Use the isAdmin middleware to check if the authenticated user is an admin
    isAdmin(req, res, async () => {
      const userToDelete = await users.findByPk(userIdToDelete);
      if (!userToDelete) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Check if the user to delete is an admin
      if (userToDelete.role === 'admin') {
        return res.status(403).json({ error: 'Forbidden: Cannot delete an admin user' });
      }
      const deletedRowCount = await users.destroy({ where: { id: userIdToDelete } });
      if (deletedRowCount > 0) {
        res.status(200).json({ message: `Delete Success for user with ID ${userIdToDelete}`, deletedUser: userToDelete });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
};
