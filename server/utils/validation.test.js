const expect = require('chai').expect

const {isRealString} = require('./validation')

describe("IsRealString", () => {
    it("Should reject non string values", () => {
        var txt = 23
        expect(isRealString(txt)).to.equal(false)
    })
    it("Should reject strings with only spaces", () => {
        var txt = "      "
        expect(isRealString(txt)).to.equal(false)
    })
    it("Should allow strings with non space values", () => {
        var txt = " Moshe Afia   "
        expect(isRealString(txt)).to.equal(true)
    })

})