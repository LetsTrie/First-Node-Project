const articleModel = require("../models/blog");

const blogvalidations = require("../validations/blog").blogValidation;

module.exports.GET_myProfile = (req, res, next) => res.render("myprofile", {
    adminData : req.user
});

module.exports.GET_openpost = (req, res, next) => {
    const token = req.params.token;
    // console.log(token);
    articleModel.findOne({
        _id: token,
    })
    .then(article => {
        // let modified_article = article;
        // let parsedTime = modified_article.date.toString().trim().split(" ");
        // modified_article.date = parsedTime[1] + " " + parsedTime[2] + " " 
        //                         + parsedTime[3] + " " + parsedTime[4];
        // console.log(modified_article);
        return res.render("eachpost", {
            article: article,
            userID: req.user._id
        });

    }).catch(err => console.log("GOT ERROR"));

    // June 24 2017 at 6:15 PM 
}

module.exports.GET_all_blogs = (req, res, next) => {
    let posts = [];
    articleModel.find().sort({date:-1}) .then(art => {
        return res.render("blogs", {
            art: art,
            whosePost: "all"
        });
    })
    .catch(err => returnError({ msg: "Getting Error In Getting Data" }))
};

module.exports.GET_my_blogs = (req, res, next) => {
    let posts = [];
    articleModel.find({
        userID: req.user._id
    }).sort({date:-1}) .then(art => {
        return res.render("blogs", {
            art: art,
            whosePost: "mine"

        });
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
    if (error) return returnError({msg : "Data is not Valid"});
    if (!data.title || !data.editor) return returnError({msg : "Please Fillup the form properly"});
    // console.log(req.user);
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
        // console.log("OKAY");
        return res.redirect("/homepage/blogs/all");
        //  homepage/myprofile dile kaj kore na keno??
    })
    .catch(err => returnError({
        msg: "Getting Error In Saving Data"
    }))

};

module.exports.DELETE_post = (req, res, next) => {
    const token = req.params.token;
    let posts = [];
    articleModel.findOneAndDelete({
        _id: token
    }).then(art => {
        req.flash('success_msg', 'Your Blog is deleted');
        return res.redirect("/homepage/blogs/all");
    })
    .catch(err => returnError({ msg: "Getting Error In Getting Data" }))
}

// router.get("/blogs/delete/:token", ensureAuthenticated, homepageController.DELETE_post);
// router.post("/blogs/afterDeletePost/:token", ensureAuthenticated, homepageController.REPOST_post);


module.exports.UPDATE_post = (req, res, next) => {
    const token = req.params.token;
    let posts = [];
    articleModel.findOne({
        _id: token
    }).then(art => {
        return res.render("createnewblog", {
            post: art
        });
    })
}

module.exports.REPOST_post = (req, res, next) => {
    const returnError = (err) => {
        let errors = [];
        errors.push(err);
        return res.render("createnewblog", {
            errors
        });
    }
    let data = {
        title: req.body.title,
        editor: req.body.editor
    };
    console.log("Before Validation");
    console.log(data);
    console.log("END");
    const { error } = blogvalidations(data);
    if (error){
        console.log(error);
        return returnError({msg : "Data is not Valid"});
    } 
    if (!data.title || !data.editor) return returnError({msg : "Please Fillup the form properly"});
    // console.log(req.user);
    let newArticle;
    articleModel.findOne({
        _id: req.body.hiddenID
    })
     .then(art => {
         console.log("This is in Database");
         console.log(art);
         console.log("this is request.body");
         console.log(req.body);
        newArticle = art;
        if(art.postTitle === data.title && art.postContent === data.editor) {
            req.flash('success_msg', 'You Edited Nothing');
            return res.redirect("/homepage/blogs/" + newArticle._id);
        }
        newArticle.postTitle = data.title;
        newArticle.postContent = data.editor;
        newArticle.date = Date.now();
        
        newArticle.save().then(art => {
            req.flash('success_msg', 'Your Blog is Updated');
            // return res.redirect("/admin/login");
            // console.log("OKAY");
            return res.redirect("/homepage/blogs/" + newArticle._id);
            //  homepage/myprofile dile kaj kore na keno??
        })
        .catch(err => returnError({
            msg: "Getting Error In Saving Data"
        }))


     })
     .catch(err => console.log(err));

    

}
