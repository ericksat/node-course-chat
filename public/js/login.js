"use strict";

var socket = io()

socket.on('connect', function() {
    console.log("Connected")
})

class Login {
    constructor() {
        this.isConnected = false;
        // Clear local storage
        delete(window.localStorage.name)
        delete(window.localStorage.room)

        $(document).ready((e) => {
            $("#login__form").on('submit', (e) => {
                e.preventDefault();
                this.tryLogin($("#login__name").val(), $("#login__room").val())
            })
        })
    }

    tryLogin(name, room) {
        socket.emit('login', {name, room}, (obj) => {
            if (obj.error) {
                alert("Error: " + obj.error);
            } else {
                window.localStorage.name = name;
                window.localStorage.room = room;
                window.location.href = `/chat.html`
            }
        })
    }
}

const login = new Login();