const expect = require('expect')

var {generateMessage} = require('./message')

describe("Generate Message", () => {
    it("Should generate a message", () => {
        var text = "Text";
        var from = "From";

        var message = generateMessage(from, text)

        expect(message).toMatchObject({from, text})
        expect(typeof message.createdAt).toBe("number")
    })
})