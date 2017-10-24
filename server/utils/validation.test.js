const expect = require('expect')

const {isRealString} = require('./validation')

describe("IsRealString", () => {
    it("Should reject non string values", () => {
        var txt = 23
        expect(isRealString(txt)).toBe(false)
    })
    it("Should reject strings with only spaces", () => {
        var txt = "      "
        expect(isRealString(txt)).toBe(false)
    })
    it("Should allow strings with non space values", () => {
        var txt = " Moshe Afia   "
        expect(isRealString(txt)).toBe(true)
    })

})