"use strict";

var socket = io()

class Chat {
    constructor() {
        this.unread = 0;
        this.room = localStorage.room || "";
        this.me = localStorage.name || "";

        this.addDomEvents()
        this.addSocketEvents()
    }

    addDomEvents() {
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

        // Clear unread when focusing on messageBar
        $("input[name=message]").on('focus', () => {
            this.unread = 0;
            this.updateTitle()
        })
    }

    addSocketEvents() {
        socket.on('connect', () => {
            // var params = jQuery.deparam(window.location.search) // Not using the URL query part anymore
            this.unread = 0; // Verify that it's reset
            var params = {
                name: this.me,
                room: this.room
            }
            if (!params.name || !params.room) {
                return window.location.href = "/"
            }
            $("#chat__sidebar__room").html(params.room)
            this.updateTitle()
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

        socket.on('newMessage', (message) => {
            var formattedTime = moment(message.createdAt).format("DD/MM/YYYY hh:mm")

            var template = jQuery("#message-template").html();
            var html = Mustache.render(template, {
                text: message.text,
                from: message.from !== this.me ? message.from : "You",
                createdAt: formattedTime
            })

            this.appendNewMessage(html, message.from)
        })

        // Location message legacy code
        /*socket.on('newLocationMessage', function(message) {
            var formattedTime = moment(message.createdAt).format("DD/MM/YYYY hh:mm")

            var template = jQuery("#location-message-template").html();
            var html = Mustache.render(template, {
                url: message.url,
                from: message.from,
                createdAt: formattedTime
            })

            appendNewMessage(html, message.from)
        }) */

        socket.on('updateUserList', (users) => {
            users.sort((a, b) => {
                if (a === this.me) return -1;
                if (b === this.me) return 1;

                if (a < b) return -1;
                if (a > b) return 1
                return 0;
            })
            var ol = jQuery("<ol></ol>")
            users.forEach((user) => {
                if (user !== this.me) {
                    ol.append(jQuery("<li></li>").text(user))
                } else {
                    ol.append(jQuery("<li></li>").text(`*${user}*`).addClass('bold'))
                }
            });

            jQuery("#users").html(ol)
        })
    }

    updateTitle() {
        let title = "Chat - " + this.room;
        if (this.unread > 0) {
            title += " (" + this.unread + ")"
        }

        document.title = title;
    }

    appendNewMessage(html, from) {
        jQuery("#messages").append(html)
        this.scrollToBottom()

        if (from !== this.me) {
            if (from === "Admin") {
                document.querySelector("#audio__admin").play()
            } else {
                this.unread++;
                this.updateTitle()
                document.querySelector("#audio__pop").play()
            }
        }
    }

    scrollToBottom() {
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
}

var chat = new Chat()