var socket = io()
socket.on('connect', function() {
    console.log("Connected, dude")

    socket.emit('createEmail', {
        from: "arikshtain@gmail.com",
        to: "somehotty@hotmail.com",
        text: "Hi this is me, your lord and master",
        createdAt: new Date().getTime()
    })

    socket.emit('createMessage', {
        from: "me",
        to: "someone",
        text: "Test text"
    })

    socket.emit('createMessage', {
        from: "someone",
        to: "me",
        text: "B00bs!"
    })
})

socket.on('disconnect', function() {
    console.log("Disconnected")
})

socket.on('newMessage', function(message) {
    console.log("New Message", message)
})