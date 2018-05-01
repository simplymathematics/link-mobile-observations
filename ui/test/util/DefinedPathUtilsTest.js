import { expect } from 'chai';
import { getDefinedOrElse, callFunctionWithParamIfDefined } from '../../app/src/scripts/util/DefinedPathUtils';

const testObject = {
    'test1': {
        'test2': {
            'test3': "FOO"
        },
        'badTest': undefined
    }};

describe('(Function) getDefinedOrElse', function () {
    it('should return value from given path if defined', function () {
        let result = getDefinedOrElse(testObject, "test1.test2.test3", "BAR");

        expect(result).to.equal("FOO");
    });

    it('should return alternate value if given path is not defined', function () {
        let result = getDefinedOrElse(testObject, "test1.mango.test3", "BAR");

        expect(result).to.equal("BAR");
    });

    it('should return alternate value if given path is defined but value at path is undefined', function () {
        let result = getDefinedOrElse(testObject, "test1.badTest", "BAR");

        expect(result).to.equal("BAR");
    });
});

describe('(Function) callFunctionWithParamIfDefined', function () {
    it('should call given function if given path is defined', function () {
        var result = "";

        callFunctionWithParamIfDefined(testObject, "test1.test2.test3", (obj => result = obj));

        expect(result).to.equal("FOO");
    });

    it('should not call given function if given path is undefined', function () {
        var result = "";

        callFunctionWithParamIfDefined(testObject, "test1.mango.test3", (obj => result = obj));

        expect(result).to.equal("");
    });

    it('should not call given function if given path is defined but value at path is undefined', function () {
        var result = "";

        callFunctionWithParamIfDefined(testObject, "test1.badtest", (obj => result = obj));

        expect(result).to.equal("");
    });
});