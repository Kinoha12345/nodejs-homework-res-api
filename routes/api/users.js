const express = require('express');
const router = express.Router();
const { User } = require('../../models')
const { Conflict, Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken')

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
        
    }
})