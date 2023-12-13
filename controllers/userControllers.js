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
