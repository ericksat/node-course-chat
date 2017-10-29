"use strict";

var socket = io()

class Login {
    constructor() {
        this.isConnected = false;
        // Clear local storage
        delete(sessionStorage.name)
        delete(sessionStorage.room)
        delete(sessionStorage.roomPass)

        $(document).ready((e) => {
            $("#login__form").on('submit', (e) => {
                e.preventDefault();
                this.tryLogin($("#login__name").val(), $("#login__room").val(), $("#login__room__pass").val())
                .then(() => {
                    window.location.href = `/chat.html`
                }).catch((e) => {
                    alert(e.message)
                })
            })
        })

        socket.on('connect', function() {
            console.log("Connected")
            this.isConnected = true;
        })
    }

    tryLogin(name, room, roomPass) {
        return new Promise((resolve, reject) => {
            socket.emit('login', {name, room, roomPass}, (obj) => {
                if (obj.error) {
                    reject(new Error(obj.error));
                } else {
                    sessionStorage.name = name;
                    sessionStorage.room = room;
                    sessionStorage.roomPass = roomPass;
                    resolve({name, room, roomPass})
                }
            })
        })
    }
}

const login = new Login();