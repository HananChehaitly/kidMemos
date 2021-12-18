function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        res.status(201).json({
            authentication: '1'
        });
    } else{
        res.status(201).json({
            authentication: '0'
        });
    }
}

module.exports = {
    isLoggedIn : isLoggedIn
};

