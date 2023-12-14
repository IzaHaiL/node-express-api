const { users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    res.status(200).json({ message: `Register user with usernames ${usernames} Success`,newUser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

    // Generate a token (you may use a library like jsonwebtoken)
    const token = jwt.sign(
      {
        userId: user.id,
        usernames: user.usernames,
        email: user.email,
        role: user.role,
      },
      'jwtsementara',
      {
        expiresIn: '1h', // Token expiration time (adjust as needed)
      }
    );

    // Include user information in the response
    const userResponse = {
      userId: user.id,
      usernames: user.usernames,
      email: user.email,
      role: user.role,
      // Add other user details as needed
    };

    res.status(200).json({ message: `Login User ID ${user.id} Success`, token, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Sign out endpoint
async function signOut(req, res) {
  // TODO: Implement sign-out logic
  // For example, if you're using tokens, you might want to clear the token on the client side
  res.status(200).json({ message: 'Sign-out successful' });
}

// Get all users endpoint
async function getAllUsers(req, res) {
  try {
    const allUsers = await users.findAll();
    res.status(200).json ({ message: `Get All Users Success`, allUsers: allUsers });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get user detail endpoint
async function getUserDetail(req, res) {
  const userId = req.params.id;

  try {
    const user = await users.findByPk(userId);
    if (user) {
      res.status(200).json({ message: `Get Detail ID ${userId} Success`, userDetail: user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Update user endpoint
async function updateUser(req, res) {
  const userId = req.params.id;
  
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}





// Delete user endpoint
async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    const user = await users.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const deletedRowCount = await users.destroy({ where: { id: userId } });

    if (deletedRowCount > 0) {
      res.status(200).json({ message: `Delete Success for user with ID ${userId}`, deletedUser: user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
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
