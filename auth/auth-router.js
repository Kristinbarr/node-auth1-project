const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const Users = require('../users/users-model')

// POST - register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await Users.findBy({ username }).first()

    // if username is already in the db
    if (user) {
      return res.status(409).json({
        message: 'username is already taken',
      })
    }
    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 12),
    })

    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
})

// POST - login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await Users.findBy({ username }).first()

    if (!user) {
      return res.status(401).json({
        message: 'invalid credentials',
      })
    }

    // hash the password again and see if it matches what we have in the database
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials',
      })
    }

    // generate a new session for this user,
    // and sends back a session ID
    req.session.user = user

    res.json({
      message: `Welcome ${user.username}!`,
    })
  } catch (error) {
    next(error)
  }
})

// GET - logout
router.get('/logout', (req, res, next) => {
  try {
    req.session.destroy(err => {
      if (err) {
        next(err)
      } else {
        res.status(204).end()
      }
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
