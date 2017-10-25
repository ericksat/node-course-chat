const expect = require("expect")

const {Users} = require('./users')

describe("Users", () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id: 1,
                name: "Moshe",
                room: "Node Course"
            },{
                id: 2,
                name: "Kobi",
                room: "React Course"
            },{
                id: 3,
                name: "Meital",
                room: "Node Course"
            }
        ]
    })

    it("Should add a new user", () => {

        // var user = {id: 123, name: "Moshe", room: "The Office Fans"};
        // users.addUser(user.id, user.name, user.room)
        // expect(users.users).toEqual([user])
    })

    it("Should returns names for Node Course", () => {
        var userList = users.getUserList("Node Course")
        expect(userList).toEqual(["Moshe", "Meital"])
    })

    it("Should returns names for React Course", () => {
        var userList = users.getUserList("React Course")
        expect(userList).toEqual(["Kobi"])
    })

    it("Should remove a user", () => {
        var removed = users.removeUser(2)
        console.log(removed)
        expect(users.users.length).toEqual(2)
        expect(removed.id).toBe(2)
    })

    it("Should not remove a user", () => {
        var removed = users.removeUser(5)
        expect(users.users.length).toEqual(3)
        expect(removed).toBeFalsy()
    })

    it("Should find a user", () => {
        var user = users.getUser(1);
        expect(user.id).toBe(1)
    })

    it("Should not find a user", () => {
        var user = users.getUser(5);
        expect(user).toBeFalsy()
    })
})