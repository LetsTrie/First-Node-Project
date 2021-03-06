const express = require("express");
const router = express.Router();

const homepageController = require("../controllers/homepage");
const {
    ensureAuthenticated,
    forwardAuthenticated
} = require('../config/authenticatedOrNot');

router.get("/blogs/all", ensureAuthenticated, homepageController.GET_all_blogs);
router.get("/blogs/mine", ensureAuthenticated, homepageController.GET_my_blogs);
router.get("/blogs/:token", ensureAuthenticated, homepageController.GET_openpost);
router.get("/blogs/update/:token", ensureAuthenticated, homepageController.UPDATE_post);
router.get("/blogs/delete/:token", ensureAuthenticated, homepageController.DELETE_post);
router.post("/blogs/afterDeletePost", ensureAuthenticated, homepageController.REPOST_post);
router.get("/createnewblog", ensureAuthenticated, homepageController.GET_createnewblog)
router.post("/createnewblog", ensureAuthenticated, homepageController.POST_createnewblog)
module.exports = router;