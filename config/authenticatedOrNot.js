module.exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/admin/login');
}

module.exports.forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/admin/homepage');
}