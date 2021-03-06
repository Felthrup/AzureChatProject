var express = require('express');
var router = express.Router();


// Landing page route
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index');
});

// Ensure only authenticated visitors access '/'
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;