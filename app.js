const express = require('express')
const logger = require('morgan')
const app = express()
const usersRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')
const db = require('./db/mongodb')
require('dotenv').config()
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

db();

app.use(express.static(AVATAR_OF_USERS))
app.use(logger(formatsLogger))
app.use(cors('*'))
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
