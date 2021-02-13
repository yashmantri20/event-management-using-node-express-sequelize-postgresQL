const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, "eventmanagement");
                req.decoded = user;
                next();
            } catch (err) {
                res.json({
                    message: "Not Authorized"
                })
            }
        }
    }
    else {
        res.json({
            message: "Authentication Error"
        })
    }
};