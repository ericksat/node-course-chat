var socket = io()

var unread = 0;
var room = "";
var me = "";

function updateTitle() {
    let title = "Chat - " + room;
    if (unread > 0) {
        title += " (" + unread + ")"
    }
    window.document.title = title;
}

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
    $("#chat__sidebar__room").html(params.room)
    room = params.room
    me = params.name
    unread = 0
    updateTitle()
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = "/"
        } else {
            console.log("Joined successfully.")
        }
    })

    console.log("Connected to " + params.room + ", " + params.name)
})

socket.on('disconnect', function() {
    console.log("Disconnected")
    // Only runs on page refresh, so don't do anything
    // window.location.href = "/";
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

    if (message.from !== me) {
        unread++;
        updateTitle()
        document.querySelector("#audio__pop").play()
    }
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
})

socket.on('updateUserList', (users) => {
    users.sort()
    var ol = jQuery("<ol></ol>")
    users.forEach(function(user) {
        ol.append(jQuery("<li></li>").text(user))
    });

    jQuery("#users").html(ol)
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

// Clear unread when focusing on messageBar
$("input[name=message]").on('focus', () => {
    unread = 0;
    updateTitle()
})