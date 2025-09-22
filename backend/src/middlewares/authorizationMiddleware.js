export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles;

        const hasRole = userRoles.some(role => allowedRoles.includes(role));

        if(!hasRole) return res.status(403).json({error: "No tienes permisos para acceder a este recurso"});

        next();
    };
};