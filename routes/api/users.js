const express = require('express');
const router = express.Router();
const  User  = require('../../db/users')
const UploadService = require('../../services/file-upload')
const { Conflict, Unauthorized } = require('http-errors');
const upload = require('../../helpers/uploads')
const jwt = require('jsonwebtoken')
const {authentication} = require('../../middlewares/authenticate')
const EmailService = require('../../services/email/service')
const { CreateSenderNodemailer } = require('../../services/email/sender')
require('dotenv').config()
const {SECRET} = process.env



router.post('/signup', async (req, res, next) => {
    try {
        const {name, email, password, subscription = 'starter' } = req.body;
        const user = await User.findOne({email})
        

        if (user) {
            throw new Conflict('Email in use')
        }

        // const newUser = new User({email, subscription})
        // newUser.setPassword(password)
        // newUser.save()

        const newUser = await Users.create({
            name,
            email,
            password,
            subscription,
          })
        
        const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSenderNodemailer(),
          )

          const statusEmail = await emailService.sendVerifyEmail(
            newUser.email,
            newUser.name,
            newUser.verifyToken,
          )


        res.status(201).json({ user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            subscription: newUser.subscription,
            avatar: newUser.avatar,
            successEmail: statusEmail,
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

router.patch('/avatar', authentication, upload.single('avatarURL'), async (req, res, next) => { 
    const id = String(req.user._id)
    const file = req.file
    const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS
    const destination = path.join(AVATAR_OF_USERS, id)
    await mkdrip(destination)
    const uploadService = new UploadService
    const avatarURL = await uploadService.save(file, id)
    await User.updateOne({ _id: id }, { avatarURL })

    return res.status(200).json({
        status: 'success',
    code: 200,
    date: {
      avatarURL,
    },
    })
})

router.get('/verify/:token', async (req, res, next) => {
    const user = await User.findOne(req.params.token)
    if (user) {
      await User.updateOne(user._id, true, null)
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          message: 'Success',
        },
      })
    }
  
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid token',
    })
  })


  router.post('/verify', async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne(email)
    if (user) {
      const { email, name, verifyToken } = user
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderNodemailer(),
      )
  
      const statusEmail = await emailService.sendVerifyEmail(
        email,
        name,
        verifyToken,
      )
    }
  
    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        message: 'Success',
      },
    })
  })

module.exports = router;