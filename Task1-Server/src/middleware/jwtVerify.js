const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    jwt.verify(token, 'secret-key', (err, admin) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.admin = admin;
        next();
    });
};
