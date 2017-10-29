class Room {
    constructor(name, pass) {
        this.name = name;
        this.pass = pass;
        this.users = [];
    }

    addUser(name) {
        this.users.push(name);
    }

    removeUser(name) {
        this.users = this.users.filter(user => user !== name)
    }

    hasUser(name) {
        let found = this.users.filter(user => user === name);
        return found.length > 0;
    }
}

class Rooms {
    constructor() {
        this.rooms = [];
    }

    addRoom(name, pass) {
        if (this.hasRoom(name)) throw Error("Room already exists");
        this.rooms.push(new Room(name, pass));
    }

    hasRoom(name) {
        let found = this.rooms.filter(room => room.name === name)
        return found > 0;
    }

    getRoom(name) {
        let found = this.rooms.filter(room => room.name === name);
        if (found.length > 0) return found[0]
        return null;
    }

    /**
     * Checks if room exist: if it does, tests pass, otherwise creates it.
     *
     * Doesn't actually join the user at the moment
     *
     * @param {string} name
     * @param {string} pass
     */
    tryJoin(name, pass) {
        let room = this.getRoom(name);
        if (!room) {
            this.addRoom(name, pass)
            return true;
        } else {
            if (pass !== room.pass) return false;
            return true;
        }
    }
}

let rooms = new Rooms();

module.exports = {
    rooms
}