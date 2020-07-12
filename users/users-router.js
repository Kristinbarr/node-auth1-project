const express = require("express")
const restricted = require('../auth/restricted')
const router = express.Router()

// GET - users
router.get('/users', restricted(), async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})


// GET - user by id