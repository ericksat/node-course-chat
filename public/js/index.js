var socket = io()
socket.on('connect', function() {
    console.log("Connected, dude")
})

socket.on('disconnect', function() {
    console.log("Disconnected")
})

socket.on('newMessage', function(message) {
    console.log("New Message", message)
    var li = jQuery("<li></li>")
    li.text(`${message.from}: ${message.text}`)

    jQuery("#messages").append(li)
})

// socket.emit("createMessage", {
//     from: "Joe", text: "Bob"
// }, function(data) {
//     console.log("Got", data)
// })

jQuery("#message-form").on('submit', function(e) {
    e.preventDefault();

    socket.emit("createMessage", {
        from: "Anonymous",
        text: jQuery("input[name=message]").val()
    }, function(data) {
        console.log(data)
        $("input[name=message]").val("")
    })
})

var locationBtn = jQuery("#send-location")
locationBtn.on('click', function() {
    if (!navigator.geolocation) {
        return alert("Sorry, your browser sucks balls. Plz update to something from after 1895")
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(err) {
        alert("Unable to fetch location, sorry.")
    })
})