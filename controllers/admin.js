const bcrypt = require("bcryptjs");
const passport = require('passport');
const crypto = require("crypto");

const userModel = require("../models/admin");
const validations = require("../validations/admin");
const sendResetPassword = require("../models/sendingMail").sendResetPassword;
const regValidations = validations.regValidation;

let errors = [];

module.exports.GET_Register = (req, res, next) => res.render("register");
module.exports.POST_Register = (req, res, next) => {

    const data = req.body;
    // console.log(req.file);
    // {
    //     fieldname: 'image',
    //     originalname: 'csedu_logo1.png',
    //     encoding: '7bit',
    //     mimetype: 'image/png',
    //     destination: 'data/profilePicture/',
    //     filename: '2019-06-21T06:27:40.305Z-csedu_logo1.png',
    //     path: 'data/profilePicture/2019-06-21T06:27:40.305Z-csedu_logo1.png',
    //     size: 160051
    // }

    const returnError = (err) => {
        errors.push(err);
        return res.render("register", { errors });
    }

    const { error } = regValidations(data);
    if (error) return returnError({msg : "Data is not valid"});
    if( !req.file ) return returnError({ msg: "Give Some Valid File" });
    if (data.password !== data.confirmPassword) return returnError({ msg: "Password Not Matching" });

    userModel.findOne({ email: data.email }).then(user => {
        if (user) return returnError({ msg: "Email already Exists" });
        userModel.findOne({  regNo: data.regNo }).then(user => {
            if (user) return returnError({  msg: "Registration Number already Exists" });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(data.password, salt, (err, hashPassword) => {
                    const newuser = new userModel({
                        username: data.username,
                        propicURL: req.file.filename,
                        regNo: data.regNo,
                        email: data.email,
                        password: hashPassword
                    });

                    newuser.save().then(user => {
                        req.flash('success_msg', 'You are now registered and can log in');
                        return res.redirect("/admin/login");
                    })
                    .catch(err => returnError({ msg: "Getting Error In Saving Data" }))
                });
            });
        })
        
    })
    .catch(err => returnError({ msg: "Getting Error In Getting Data" }))
}

module.exports.GET_Login = (req, res, next) => res.render("login");
module.exports.POST_Login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin/homepage',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
};

module.exports.GET_Logout = (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You have Successfully Logged out');
    res.redirect('/');
};

module.exports.GET_forgetpass = (req, res, next) => res.render("forgetpass");
module.exports.POST_forgetpass = (req, res, next) => {
    errors = [];
    const returnError = (err) => {
        errors.push(err);
        return res.render("forgetpass", { errors });
    }
    
    crypto.randomBytes(32, (err, buffer) => {
        if(err) return returnError({msg : 'Crypto Not Working'});
        const token = buffer.toString("hex");
        const data = req.body;
        userModel.findOne({ email: data.email }).then(user => {
            if ( !user ) return returnError({msg: 'Email does Not Exist'});
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            user.save().then(user => {
                req.flash('success_msg','A link is send to your email. check there please');
                res.redirect("/");
                return sendResetPassword(user.username, data.email, token);
            })
            .catch(err => returnError({msg: 'Getting Error in saving data..</h1>'}));
        })
        .catch(err => returnError({msg: 'Getting Error in getting data..</h1>'}));
    })
}

module.exports.GET_acceptToken = (req, res, next) => {
    const token = req.params.token;
    userModel.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            if (!user) return res.status(400).send("User Not Found");
            return res.render("newpass", {
                adminID: user._id,
                adminToken: user.resetToken
            });
        })
}


module.exports.POST_newpass = (req, res, next) => {
    const newPassword = req.body.password.toString().trim();
    const newConfirmPassword = req.body.confirmPassword.toString().trim();
    const userId = req.body.userID.toString().trim();
    const passwordToken = req.body.tokenID.toString().trim();
    let resetUser;

    if (newPassword !== newConfirmPassword) {
        req.flash('error_msg', 'Password Not Matching');
        return res.redirect(`/admin/forgetpass/${passwordToken}`);
    }
    userModel.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {
            $gt: Date.now()
        },
        _id: userId
    })
     .then(user => {
         resetUser = user;
         return bcrypt.hash(newPassword, 12);
     })
     .then(hashedPassword => {
         resetUser.password = hashedPassword;
         resetUser.resetToken = undefined;
         resetUser.resetTokenExpiration = undefined;
         return resetUser.save();
     })
     .then(result => {
        req.flash('success_msg', 'Password Successfully Changed');
        res.redirect('/admin/login');
     })
     .catch(err => console.log(err));
}
