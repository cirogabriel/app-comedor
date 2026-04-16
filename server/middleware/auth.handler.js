// import boom from "@hapi/boom";

// export const checkRoles = (...roles) => {
//     return (req, res, next) => {
//         const user = req.user;
//         if (roles.includes(user.role)) next();
//         else next(boom.unauthorized());
//     }
// }


import boom from "@hapi/boom";

export const checkRoles = (req, res, next) => {
    if (!req.user) return next(boom.unauthorized());
    next();
}