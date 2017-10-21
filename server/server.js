const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

var {generateMessage, generateLocationMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

var app = express()

var server = http.createServer(app)
var io = socketIO(server)

// Static files
app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected.")

    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat."))
    socket.broadcast.emit("newMessage", generateMessage("Admin", "A new user has joined the chat."))

    socket.on('createMessage', (message, callback) => {
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback("This is from the server");
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit("newLocationMessage", generateLocationMessage("Admin",  coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log("User disconnected.")
    })
})

server.listen(PORT, () => {
    console.log("Server up at port " + PORT)
})

module.exports = {app}