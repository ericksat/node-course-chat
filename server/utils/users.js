/**
 * Users management
 */

class Users {
    constructor() {
        this.users = [];
    }

    /**
     *
     * @param {number} id
     * @param {String} name
     * @param {String} room
     * @returns {Object} the user that was added
     */
    addUser(id, name, room) {
        var user = {id, name, room}
        this.users.push(user)
        return user;
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

module.exports = { Users }