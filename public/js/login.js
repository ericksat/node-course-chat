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
                .then(() => {
                    window.location.href = `/chat.html`
                }).catch((e) => {
                    alert(e.message)
                })
            })
        })
    }

    tryLogin(name, room) {
        return new Promise((resolve, reject) => {
            socket.emit('login', {name, room}, (obj) => {
                if (obj.error) {
                    reject(new Error(obj.error));
                } else {
                    window.localStorage.name = name;
                    window.localStorage.room = room;
                    resolve({name, room})
                }
            })
        })
    }
}

const login = new Login();