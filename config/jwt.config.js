const jwt = require('jsonwebtoken');

module.exports = {

    generateToken: (payload, expiresIn) => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, expiresIn, {

        });
    },

    checkToken: async (req, res, next) => {
        try {
            var token = req.headers['authorization'];
            token = token.split(' ')[1];
            if (token) {
                try {
                    const a = await jwt.verify(token, process.env.JWT_SECRET_KEY);
                    req.user = a;
                    next();
                } catch (err) {
                    res.status(403).json({
                        message: 'Invalid Token. Login Again!'
                    });
                }
            }
        } catch (err) {
            res.status(403).json({
                message: 'Invalid Token.'
            });
        }
    },

    parseToken: async (req, res, next) => {

        let token = req.headers['authorization'];
        if (token) {
            token = token.split(' ')[1];
            try {
                const a = await jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = a;
            } catch (err) {
                req.user = null;
            }
        }
        next();
    },

};
