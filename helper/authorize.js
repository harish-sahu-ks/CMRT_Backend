// const {expressjwt:jwt} = require('express-jwt');
// //const { secret } = require('config.json');

// module.exports = authorize;

// function authorize(roles = []) {

//    // console.log('Hello03');
//     // roles param can be a single role string (e.g. Role.User or 'User') 
//     // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
//     if (typeof roles === 'string') {
//         roles = [roles];
//     }
// secret = "JKJKJKJKJKJKGFFFF";  
//     return [
//         // authenticate JWT token and attach user to request object (req.user)
//         jwt({ secret:"JKJKJKJKJKJKGFFFF", algorithms: ['HS256'] }),  

//         // authorize based on user role
//         (req, res, next) => {
//             if (roles.length && !roles.includes(req.user.role)) {
//                 // user's role is not authorized
//                 return res.status(401).json({ message: 'Unauthorized' });
//             }

//             // authentication and authorization successful
//             next();
//         }
//     ];
// }

const jwt = require('express-jwt');
//const { secret } = require('config.json');

module.exports = authorize;

function authorize(roles = []) {

   // console.log('Hello03');
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
secret = "JKJKJKJKJKJKGFFFF";  
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret:"JKJKJKJKJKJKGFFFF", algorithms: ['HS256'] }),  

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}