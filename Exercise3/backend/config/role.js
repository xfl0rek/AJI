const checkRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'You do not have privileges to finish that operation' });
        }
        next();
    };
};

module.exports = checkRole;
