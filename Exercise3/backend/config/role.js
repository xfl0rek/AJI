const checkRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Zakładamy, że dane użytkownika są w req.user dzięki authMiddleware

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Nie masz uprawnień do wykonania tej operacji.' });
        }
        next(); // Jeśli użytkownik ma odpowiednią rolę, przechodzimy do następnej funkcji
    };
};

module.exports = checkRole;
