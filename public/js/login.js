"use strict";

var socket = io()

socket.on('connect', function() {
    console.log("Connected")
})

class Login {
    constructor() {
        this.isConnected = false;

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
                alert("Success!")
                window.location.href= `/chat.html?name=${name}&room=${room}`
            }
        })
    }
}

const login = new Login();