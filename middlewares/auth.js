/* eslint-disable radix */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
// Array untuk menyimpan token yang telah di-blacklist
const authData = {
  blacklistedTokens: [],
};
// Function to generate access token
function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      usernames: user.usernames,
      email: user.email,
      role: user.role,
    },
    'jwtsementara',
    {
      expiresIn: '15m', // Access token expiration time (adjust as needed)
    },
  );
}
// Function to generate refresh token
function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      usernames: user.usernames,
      email: user.email,
      role: user.role,
    },
    'refreshTokenSecret',
    {
      expiresIn: '7d', // Refresh token expiration time (adjust as needed)
    },
  );
}
// Middleware to authenticate access token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Access token not provided' });
  }
  jwt.verify(token, 'jwtsementara', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid access token' });
    }
    req.user = user;
    next();
  });
}

// Middleware to authenticate refresh token
function authenticateRefreshToken(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next();
  }

  jwt.verify(refreshToken, 'refreshTokenSecret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid refresh token' });
    }

    req.user = user;
    next();
  });
}
// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: You do not have admin privileges' });
  }
}
// Middleware to check if the user is the owner of the requested resource or an admin
function isUserOwner(req, res, next) {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.user.userId; // User ID from the authenticated user's token

  // Check if the user is the owner of the requested resource or an admin
  if (req.user.role === 'admin' || requestedUserId === authenticatedUserId) {
    next(); // User is the owner or admin, proceed to the next middleware/controller
  } else {
    res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
  }
}
// Middleware untuk mengecek apakah token di dalam blacklist
function checkBlacklist(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token && authData.blacklistedTokens.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
  }
  next();
}
// Fungsi untuk menambahkan token ke dalam blacklist
function clearToken(token) {
  authData.blacklistedTokens.push(token);
}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  authenticateRefreshToken,
  isAdmin,
  checkBlacklist,
  clearToken,
  authData,
  isUserOwner, // Menambahkan objek authData ke dalam ekspor
};
