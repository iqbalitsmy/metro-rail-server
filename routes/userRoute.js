const express = require("express")
const router = express.Router()
const { register, login, update, deleteUser, users, logout, user, getUserDetails, registerByAdmin, updateUser, usersEmail } = require('../controllers/userController')
const { adminAuth, userAuth } = require("../middleware/auth");
const uploadImage = require("../utils/uploadImage");


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(userAuth, logout);
// Update user
router.route("/update/:id").put(updateUser);

// Get user details from jwt
router.route("/me").get(userAuth, getUserDetails);

// --------get a user from admin-------------------------
router.route("/user/:id").get(adminAuth, user);

// get all user from admin
router.route("/users").get(adminAuth, users);

// Upload Image
router.route("/upload-image").post((req, res) => {
    uploadImage(req.body.image)
        .then((url) => res.send(url))
        .catch((err) => res.status(500).send(err));
});

// add new user by admin
router.route("/admin/register").post(adminAuth, registerByAdmin);
router.route("/update-role").put(adminAuth, update);
router.route("/deleteUser/:id").delete(adminAuth, deleteUser);

// get all user email by admin
router.route("/users-email").get(adminAuth, usersEmail);



module.exports = router