const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const Users = require('../users/users-model')

// POST - register

router.post("/register", async (req, res) => {
    try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			// hash the password with a time complexity of "10"
			password: await bcrypt.hash(password, 10)
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

// POST - login

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (!user) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        // hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password)
		if (!passwordValid) {
		    return res.status(401).json({
				message: "Invalid Credentials",
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