const expect = require("chai").expect;

const {Users} = require('./users')

describe("Users", () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.addUsers([
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
        ]);
    })

    it("Should add a new user", () => {
        var user = {id: 123, name: "Schnitzel", room: "The Office Fans"};
        users.addUser(user.id, user.name, user.room)
        expect(users.users.length).to.equal(4)
    })

    it("Should not add a restricted name", () => {
        var user = {id: 123, name: "Admin", room: "The Office Fans"};
        expect(() => users.addUser(user.id, user.name, user.room)).to.throw(Error)
    })

    it("Should not add an existing name", () => {
        var user = {id: 123, name: "Kobi", room: "The Office Fans"};
        expect(() => users.addUser(user.id, user.name, user.room)).to.throw(Error)
    })

    it("Should returns names for Node Course", () => {
        var userList = users.getUserList("Node Course")
        expect(userList).to.have.members(["Moshe", "Meital"])
    })

    it("Should returns names for React Course", () => {
        var userList = users.getUserList("React Course")
        expect(userList).to.eql(["Kobi"])
    })

    it("Should remove a user", () => {
        var removed = users.removeUser(2)
        expect(users.users.length).to.equal(2)
        expect(removed.id).to.equal(2)
    })

    it("Should not remove a user", () => {
        var removed = users.removeUser(5)
        expect(users.users.length).to.equal(3)
        expect(removed).to.be.null
    })

    it("Should find a user", () => {
        var user = users.getUser(1);
        expect(user.id).to.equal(1)
    })

    it("Should not find a user", () => {
        var user = users.getUser(5);
        expect(user).to.be.null
    })
})