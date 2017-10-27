/**
 * Users management
 */

const {userList} = require('./userlist')

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
        var user = {id, name: name.trim(), room: room.trim()}
        if (!userList.canAddUser(user.name)) {
            throw Error("Name is taken or forbidden.")
        }
        this.users.push(user)
        userList.addUser(user.name)
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
        userList.removeUser(user.name)
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