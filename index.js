const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const authRouter = require('./auth/auth-router')
const usersRouter = require('../users/users-router')

const server = express()
const port = process.env.PORT || 6000

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/auth', authRouter)
server.use('/api/user', usersRouter)

server.listen(port, () => {
    console.log(`server running on port ${port}`)
})