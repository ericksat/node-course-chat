const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public');

const PORT = process.env.PORT || 3000;

var app = express()

var server = http.createServer(app)
var io = socketIO(server)

// Static files
app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected.")

    socket.on('createMessage', (message) => {
        message.createdAt = new Date().getTime()
        console.log("New message created", message)
        socket.emit("newMessage", message)
    })

    socket.on('disconnect', () => {
        console.log("User disconnected.")
    })
})

server.listen(PORT, () => {
    console.log("Server up at port " + PORT)
})

module.exports = {app}