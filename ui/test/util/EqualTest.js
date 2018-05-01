import { expect } from 'chai';
import { equal, compareArrays } from '../../app/src/scripts/util/Equal';

describe("(FUNCTION) equals", function() {
    it("should match json objects identical values", function() {
        let jsonObj = {"testField1":"value1"};

        expect(equal(jsonObj,jsonObj)).to.equal(true)
    });

    it("should not match json objects with different fields", function() {
        let jsonObj1 = {"testField2":"value1"};
        let jsonObj2 = {"testField1":"VALUE2"};

        expect(equal(jsonObj1,jsonObj2)).to.equal(false)
    });

    it("should not match json objects with different amounts of fields ", function() {
        let jsonObj1 = {"testField1":"value1"};
        let jsonObj2 = {"testField1":"value1", "testField2":"value1"};

        expect(equal(jsonObj1,jsonObj2)).to.equal(false)
    });

    it("should not match two arrays with different types of data", function() {
        let arrayValue1 = [1,2,3,4,5];
        let arrayValue2 = ["1","2","3","4","5"];

        expect(equal(arrayValue1, arrayValue2)).to.equal(false)
    });

    it("should not match two arrays with different lengths", function() {
        let arrayValue1 = ["1","2","3","4"];
        let arrayValue2 = ["1","2","3","4","5"];

        expect(equal(arrayValue1, arrayValue2)).to.equal(false)
    });

    it("should not match undefined and null value", function() {
        let undefinedValue;
        let nullValue = null;

        expect(equal(undefinedValue,nullValue)).to.equal(false)
    });

    it("should not match float and integer", function() {
        let floatValue = 10.51;
        let integerValue = 3;

        expect(equal(floatValue,integerValue)).to.equal(false)
    });

    it("should match identical objects", function() {
        let object = {
            "0" : "apple",
            "1" : "pear",
            "2" : "orange"
        };

        expect(equal(object,object)).to.equal(true)
    });

    it("should not match objects with different content", function() {
        let object1 = {
            "0" : "apple",
            "1" : "pear",
            "2" : "orange"
        };

        let object2 = {
            "a" : "apple",
            "b" : "pear",
            "c" : "orange"
        };

        expect(equal(object1,object2)).to.equal(false)
    });

    it("should not match different date values", function() {
        let dateValue1 = new Date("May 17, 2017 11:13:00");
        let dateValue2 = new Date("December 25, 1999 11:13:00");

        expect(equal(dateValue1, dateValue2)).to.equal(false)
    });

    it("should not match different regex expresssions", function() {
        let regexValue1 = /[1-9]/i;
        let regexValue2 = /[A-Z]/i;

        expect(equal(regexValue1, regexValue2)).to.equal(false)
    });
});