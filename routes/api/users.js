const express = require('express');
const router = express.Router();
const  User  = require('../../db/users')
const { Conflict, Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken')
const {authentication} = require('../../middlewares/authenticate')

const {SECRET} = process.env



router.post('/signup', async (req, res, next) => {
    try {
        const {email, password, subscription = 'starter' } = req.body;
        const user = await User.findOne({email})
        

        if (user) {
            throw new Conflict('Email in use')
        }

        const newUser = new User({email, subscription})
        newUser.setPassword(password)
        newUser.save()
        
        res.status(201).json({ user: {
            email: email,
            subscription: subscription,
        }
    })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        const passwordCompare = await user?.validPasswords(password)

        if (!user || !passwordCompare) {
            throw new Unauthorized('Email or password is wrong')
        }

        const {_id, subscription} = user;
        const payload = { id: _id }

        const token = jwt.sign(payload, SECRET, {expiresIn: '1w'})
        await User.findByIdAndUpdate(_id, {token})
        res.json({
            token,
            user: { email, subscription}
        })
    } catch (error){
        next(error)
    }
})

router.get('/logout', authentication, async (req, res, next) => {
    const {_id} = req.user
    await User.findByIdAndUpdate({_id}, {token: null})

    res.status(204).json()
})

router.get('/current', authentication, async (req, res, next) => {
    const currentUser = req.user;
    const {email, subscription} = currentUser;

    res.json({ email, subscription})
})

router.patch('/', authentication, async (req, res, next) => {
    const {_id} = req.user
    const {subscription} = req.body

    const newSubscription = await User.findOneAndUpdate({ _id }, { subscription }, { new: true })

    const {email} = newSubscription
    res.json({
        status: 'update',
        code: 200,
        message: `new Subscription: ${subscription}`,
        data: {User: { email, subscription } }
    })
})

module.exports = router;