const bannedNames = ["admin", "system"] // Keep them in lower-case, since that's how we will be doing our comparisons.

/**
 * Makes sure names will be unique
 */
class UserList {
    constructor() {
        this.userNames = {}; // list will be global (tried per room, but someone could impersonate you,) and only in lower case
    }

    /**
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

    addUser(name) {
        this.userNames[name.toLowerCase()] = true; // Keep this name in filtered list
    }

    hasUser(name) {
        return this.userNames[name.toLowerCase()] !== undefined;
    }

    removeUser(name) {
        delete this.userNames[name.toLowerCase()]
    }
}

var userList = new UserList(); // This should be global, singular, and always exist

module.exports = {
    userList
}