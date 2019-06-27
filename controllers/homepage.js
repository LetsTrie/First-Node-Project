const articleModel = require("../models/blog");

const blogvalidations = require("../validations/blog").blogValidation;

module.exports.GET_myProfile = (req, res, next) => res.render("myprofile", {
    adminData : req.user
});

module.exports.GET_openpost = (req, res, next) => {
    const token = req.params.token;
    console.log(token);
    articleModel.findOne({
        _id: token,
    })
    .then(article => {
        console.log("Hi :: => " + article);
        // return res.render("eachpost", {
        //     article: article
        // });
        return res.render("eachpost", {
            article: article,
            userID: req.user._id
        });

    }).catch(err => console.log("GOT ERROR"));





    // June 24 2017 at 6:15 PM 
}

module.exports.GET_blogs = (req, res, next) => {
    let posts = [];
    articleModel.find().sort({date:-1}) .then(art => {
        return res.render("blogs", {art: art});
        // console.log(art);
    })
    .catch(err => returnError({ msg: "Getting Error In Getting Data" }))
};
module.exports.GET_createnewblog = (req, res, next) => res.render("createnewblog");
module.exports.POST_createnewblog = (req, res, next) => {
    const returnError = (err) => {
        let errors = [];
        errors.push(err);
        return res.render("createnewblog", { errors });
    }
    const data = req.body;
    const { error } = blogvalidations(data);
    if (error) return returnError({msg : error});
    if (!data.title || !data.editor) return returnError({msg : "Please Fillup the form properly"});
    console.log(req.user);
    const newArticle = new articleModel({
        userID   : req.user._id,
        username : req.user.username,
        userPropicURL: req.user.propicURL,
        postTitle: req.body.title,
        postContent: req.body.editor
    });

    newArticle.save().then(user => {
        req.flash('success_msg', 'Your Blog is published');
        // return res.redirect("/admin/login");
        console.log("OKAY");
        return res.redirect("/homepage/blogs");
        //  homepage/myprofile dile kaj kore na keno??
    })
    .catch(err => returnError({
        msg: "Getting Error In Saving Data"
    }))

};
