const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/authenticatedOrNot');

router.get("/login", forwardAuthenticated, adminController.GET_Login);
router.post("/login", adminController.POST_Login);

router.get("/register", forwardAuthenticated, adminController.GET_Register);
router.post("/register", adminController.POST_Register);

router.get("/forgetpass", forwardAuthenticated, adminController.GET_forgetpass);
router.post("/forgetpass", adminController.POST_forgetpass);

router.get("/forgetpass/:token", forwardAuthenticated, adminController.GET_acceptToken);
router.post("/newpass", adminController.POST_newpass);

router.get("/logout", ensureAuthenticated, adminController.GET_Logout);

router.get("/homepage", ensureAuthenticated, (req, res, next) => res.render("homepage", {
    adminData: req.user
}));

module.exports = router;