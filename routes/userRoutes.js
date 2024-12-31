const express = require("express");
const userController = require("../controllers/userController.js");
const { isAuth } = require("../middlewares/authMiddleware.js");
const { singleUpload, multipleUpload } = require("../middlewares/multer.js");
const rateLimit = require("express-rate-limit");

// RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store:..., // Use an external store for consistency across multiple server instances.
});

//router object
const router = express.Router();

// routes
// ============== USER ROUTES ==================

// Route to update user role
router.put("/update/:id/role", async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;
  if (!role || (role !== "user" && role !== "admin")) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// LOGIN
router.post("/login", limiter, userController.loginController);

router.get("/getusers", userController.getAllUsersController);

// REGISTER
router.post("/register", limiter, userController.registerController);

// LOGOUT
router.get("/logout", isAuth, userController.logoutController);

// GET USER PROFILE
router.get("/profile", isAuth, userController.getUserProfileController);

// UPDATE PROFILE
router.put(
  "/profile",
  isAuth,
  multipleUpload,
  userController.updateProfileController
);
router.get("/admin-users", userController.fetchAdminUsersController);

// UPDATE PROFILE PICTURE
router.put(
  "/profile/picture",
  isAuth,
  singleUpload,
  userController.updateProfilePicController
);
router.put("/update-profile", isAuth,  userController.updateProfileController);
// UPDATE PASSWORD
router.put("/password", isAuth, userController.udpatePasswordController);

// PASSWORD RESET
router.post("/password/reset", userController.passwordResetController);

// ====================================================================

module.exports = router;
