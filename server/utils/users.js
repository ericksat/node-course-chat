/**
 * Users management
 */

const bannedNames = ["admin", "system"] // Keep them in lower-case, since that's how we will be doing our comparisons.

class Users {
    constructor() {
        this.users = [];
        // Taken names list - global (tried per room, but someone could impersonate you,) and only in lower case
        this.userNames = {};
    }

    /**
     * Tests restricted and already taken names, before adding
     *
     * @param {String} name
     */
    canAddUser(name) {
        name = name.toLowerCase() // For easier comparison
        var banned = bannedNames.filter(userName => userName === name)
        if (banned.length > 0) return false;
        if (this.userNames[name]) return false;
        return true;
    }

    /**
     *
     * @param {number} id
     * @param {String} name
     * @param {String} room
     * @returns {Object} the user that was added
     */
    addUser(id, name, room) {
        var user = {id, name: name.trim(), room: room.trim()}
        if (!this.canAddUser(user.name)) {
            throw Error("Name is taken or forbidden.")
        }
        this.users.push(user)
        this.userNames[name.toLowerCase()] = true; // Keep this name in filtered list
        return user;
    }

    /**
     * Adds multiple users at once
     *
     * @param {Array} list of objects with id, name, room
     */
    addUsers(list) {
        for (let user of list) {
            this.addUser(user.id, user.name, user.room)
        }
    }

    /**
     *
     * @param {number} id
     * @returns {object} the user that was just removed
     */
    removeUser(id) {
        var user = this.getUser(id);
        if (!user) return null;

        this.users = this.users.filter(user => user.id !== id)
        delete this.userNames[user.name.toLowerCase()]
        return user;
    }

    getUser(id) {
        var user = this.users.filter(user => user.id === id)[0]
        if (!user) return null;
        return user;
    }

    getUserList(room) {
        room = room.toLowerCase()
        var users = this.users.filter( (user) => user.room.toLowerCase() === room);
        var names = users.map( (user) => user.name);

        return names;
    }
}

var users = new Users()

module.exports = { users }