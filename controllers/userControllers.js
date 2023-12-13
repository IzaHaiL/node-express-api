const { users } = require('../models');

// Sign up endpoint
async function signUp(req, res) {
  try {
    const newUser = await users.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Sign in endpoint
async function signIn(req, res) {
  // TODO: Implement sign in logic
  // This might involve checking the provided credentials and generating a token
  res.status(501).json({ error: 'Not Implemented' });
}

// Sign out endpoint
async function signOut(req, res) {
  // TODO: Implement sign out logic
  // This might involve clearing the user's session, token, or performing any necessary actions
  res.status(501).json({ error: 'Not Implemented' });
}

// Get all users endpoint
async function getAllUsers(req, res) {
  try {
    const allUsers = await users.findAll();
    res.status(200).json(allUsers);
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
      res.status(200).json(user);
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
    const [updatedRowsCount, updatedUser] = await users.update(req.body, {
      where: { id: userId },
      returning: true,
    });

    if (updatedRowsCount > 0) {
      res.status(200).json(updatedUser[0]);
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
    const deletedRowCount = await users.destroy({ where: { id: userId } });

    if (deletedRowCount > 0) {
      res.status(204).send();
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
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
};
