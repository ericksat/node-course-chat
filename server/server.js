// TODO: Phase1: general fixes
    // TODO: Add more test cases before refactoring.
    // TODO: Refactor code with classes.
// TODO: Phase2: Add a database (mongodb)
    // TODO: Actual accounts.
    // TODO: Password locekd rooms.
    // TODO: Chat history, but only after we have password locked rooms
    // TODO: ** Chat history should only save messages up to amount (1000) or date(3-7 days)
// TODO: Phase3: Images
    // TODO: Allow adding images (that would be the most awesome feature)
    // TODO: Images should be resized to take less space, and deleted after a while.
    // TODO: Allow avatars for accounts (resized, but not deleted)
// TODO: Low priority
    // TODO: Disconnect design

const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')

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

    socket.on('login', (params, callback) => {
        var name = params.name.trim()
        var room = params.room.trim()
        try {
            if (users.canAddUser(name)) {
                callback({success:true})
            } else {
                throw Error("Name is invalid or already taken.")
            }
        } catch (e) {
            console.log("Failed login")
            callback({success: false, error: e.message})
        }

    });

    socket.on('join', (params, callback) => {
        try {
            if (!isRealString(params.name) || !isRealString(params.room)) {
                throw Error("A valid name & room name are required.")
            }
            console.log(`User ${params.name} connected to ${params.room}`)
            socket.join(params.room)
            users.removeUser(socket.id)
            users.addUser(socket.id, params.name, params.room)

            io.to(params.room).emit("updateUserList", users.getUserList(params.room))
            socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat."))
            socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined.`))
            callback()
        } catch (e) {
            console.log("Join Fail", e.message)
            callback(e.message)
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
        // I don't want these since it's a security risk
        /*var user = users.getUser(socket.id)
        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name,  coords.latitude, coords.longitude))
        }*/
    })

    socket.on('disconnect', () => {
        // console.log("User disconnected")
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