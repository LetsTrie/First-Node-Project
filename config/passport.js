const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/admin');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'regNo',
            passwordField: 'password',
            passReqToCallback: true
        }, 
        (req, username, password, done) => {
            User.findOne({ regNo: username }).then(user => {
                if (!user) return done(null, false, req.flash('error_msg', 'Registration Number Not Found'));

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) return done(null, user, req.flash('success_msg', 'You Have Successfully Logged In'));
                    else return done(null, false, req.flash('error_msg', 'Password Not Matching'));
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};