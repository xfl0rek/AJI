const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = jwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user'
}).unless({
    path: ['/api/login', '/api/register']
});

module.exports = authMiddleware;