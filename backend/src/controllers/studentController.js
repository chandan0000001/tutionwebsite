/**
 * Student Controller
 */

/**
 * GET /api/student/profile
 * Returns the currently authenticated student's private profile.
 * Security: Always resolves to the authenticated user from req.student.
 */
export async function getProfile(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: req.student.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
}
