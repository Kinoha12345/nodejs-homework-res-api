const jwt = require('jsonwebtoken')
const {Unauthorized} = require('http-errors')
const User = require('../db/users')
const {SECRET} = process.env;

const authentication = async (req, res, next) => {
    try {
    const {authentication} = req.headers

    if (!authentication) {
        throw new Unauthorized('Not authorized')
    }
    const [bearer, token] = authentication.split(' ')

    if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized')
    }

    jwt.verify(token, SECRET)
    const user = await User.findOne({token})
    if (!user) {
        throw new Unauthorized('Not authorized')
    }
    req.user = user

    next()
    } catch (error) {
        if (!error.status) {
            error.status = 401
            error.message = 'Not authorized'
        }
        next(error)
    }
}

module.exports = { authentication }