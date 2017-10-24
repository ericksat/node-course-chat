var socket = io()

function scrollToBottom() {
    // Selectors
    var messages = jQuery("#messages")
    var newMessage = messages.children('li:last-child')
    // Height
    var clientHeight = messages.prop("clientHeight")
    var scrollTop    = messages.prop("scrollTop")
    var scrollHeight = messages.prop("scrollHeight")
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()
    // console.log("Added: ", clientHeight , scrollTop , newMessageHeight , lastMessageHeight)
    // console.log("Full: " + scrollHeight)
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log("Should scroll")
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search)
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = "/"
        } else {
            console.log("Joined successfully.")
        }
    })

    console.log("Connected to " + params.rooms + ", " + params.name)
})

socket.on('disconnect', function() {
    console.log("Disconnected")
})

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format("DD/MM/YYYY hh:mm")

    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery("#messages").append(html)
    scrollToBottom()

    // var li = jQuery("<li></li>")
    // li.text(`${formattedTime} ${message.from}: ${message.text}`)

    // jQuery("#messages").append(li)
})

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format("DD/MM/YYYY hh:mm")

    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery("#messages").append(html)

    // var li = jQuery("<li></li>")
    // var a  = jQuery("<a target='_blank'>My Current Location</a>")
    // li.text(`${formattedTime} ${message.from}: `)
    // a.attr('href', message.url)
    // li.append(a)
    // jQuery("#messages").append(li)
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