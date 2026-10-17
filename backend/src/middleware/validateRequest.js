/**
 * Request validation middlewares
 */

export function validateLogin(req, res, next) {
  const { username, password } = req.body || {};

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Username is required.',
    });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required.',
    });
  }

  req.body.username = username.trim().toLowerCase();
  next();
}

export function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  if (!currentPassword || typeof currentPassword !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Current password is required.',
    });
  }

  if (!newPassword || typeof newPassword !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'New password is required.',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long.',
    });
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password.',
    });
  }

  if (confirmPassword !== undefined && confirmPassword !== newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Password confirmation does not match new password.',
    });
  }

  // Ensure password has reasonable complexity (at least one letter and one number)
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  if (!hasLetter || !hasNumber) {
    return res.status(400).json({
      success: false,
      message: 'New password must contain both letters and numbers.',
    });
  }

  next();
}
