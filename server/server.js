// TODO: Admin messages should not create a pop sound or increase unread counter. Perhaps have a different sound.
// TODO: The room URL should not include the user name and room name in the query (localStorage?)
// TODO: Add more test cases before refactoring.
// TODO: Refactor code with classes.
// TODO: Allow adding images (that would be the most awesome feature)
// TODO: Chat history, but only with password locked rooms
// TODO: Password locekd rooms.
// TODO: Actual accounts, with avatars.

const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

// Static files
app.use(express.static(publicPath));

// IO BEGIN
io.on("connection", (socket) => {
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("A valid name & room name are required.")
        } else {
            console.log(`User ${params.name} connected to ${params.room}`)
            socket.join(params.room)
            users.removeUser(socket.id)
            users.addUser(socket.id, params.name, params.room)

            io.to(params.room).emit("updateUserList", users.getUserList(params.room))
            socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat."))
            socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined.`))
            callback()
        }
    })

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id)
        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text))
        }

        callback();
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id)
        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name,  coords.latitude, coords.longitude))
        }

    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left.`))
        }

    })
})

server.listen(PORT, () => {
    console.log("Server up at port " + PORT)
})

module.exports = {app}