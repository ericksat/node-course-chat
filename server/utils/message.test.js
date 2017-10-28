const expect = require('chai').expect

var {generateMessage, generateLocationMessage} = require('./message')

describe("Generate Message", () => {
    it("Should generate a message", () => {
        var text = "Text";
        var from = "From";

        var message = generateMessage(from, text)

        expect(message).to.include({from, text})
        expect(message.createdAt).to.be.a("number")
    })
})

describe("Generate Location Message", () => {
    it("Should generate a correct location object", () => {
        var from = "Admin";
        var lat = 32.08
        var lng = 34.78
        var correctUrl = `https://maps.google.com/maps?q=${lat},${lng}`

        var message = generateLocationMessage(from, lat, lng)
        expect(message).to.include({from, url: correctUrl})
        expect(message.createdAt).to.be.a("number")
    })
})