var socket = io()
socket.on('connect', function() {
    console.log("Connected, dude")
})

socket.on('disconnect', function() {
    console.log("Disconnected")
})

socket.on('newMessage', function(message) {
    var li = jQuery("<li></li>")
    li.text(`${message.from}: ${message.text}`)

    jQuery("#messages").append(li)
})

socket.on('newLocationMessage', function(message) {
    var li = jQuery("<li></li>")
    var a  = jQuery("<a target='_blank'>My Current Location</a>")
    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)
    jQuery("#messages").append(li)
})

jQuery("#message-form").on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = jQuery("input[name=message]");

    socket.emit("createMessage", {
        from: "Anonymous",
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val("")
    })
})

var locationBtn = jQuery("#send-location")
locationBtn.on('click', function() {
    if (!navigator.geolocation) {
        return alert("Sorry, your browser sucks balls. Plz update to something from after 1895")
    }

    locationBtn.prop('disabled', true).text("Sending...")

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        locationBtn.prop('disabled', false).text("Send Location")
    }, function(err) {
        alert("Unable to fetch location, sorry.")
        locationBtn.prop('disabled', false).text("Send Location")
    })
})