import { expect } from 'chai';
import loginReducer from '../../app/src/scripts/reducers/loginReducer'

describe('(REDUX) LoginReducer', function() {
    it('should return state with no modifications if action is not recognised', function () {
        expect(loginReducer(initialState(), ACTION_EMPTY)).to.deep.equal(initialState());
    });

    it('should return initialState if state is undefined', function () {
        expect(loginReducer(undefined, ACTION_EMPTY)).to.deep.equal(initialState());
    });
});

describe('(REDUX) LoginReducer (ACTION) LOGIN_RESPONSE', function() {
    it('should return original state with empty error', function() {
        expect(loginReducer(initialState(), ACTION_LOGIN_RESPONSE)).to.deep.equal(initialState());
        expect(loginReducer(initialState(), ACTION_LOGIN_RESPONSE).error).to.have.lengthOf(0);
    });
});

describe('(REDUX) LoginReducer (ACTION) LOGIN_ERROR', function() {
    it('should return original state with populated error', function() {
        let errorMessage = "Oh no! There is an error. Boo!";
        let mutatedInitialState = initialState();
        mutatedInitialState.error = errorMessage;

        let stateResult = loginReducer(initialState(), ACTION_LOGIN_ERROR(errorMessage));

        expect(stateResult).to.deep.equal(mutatedInitialState);
        expect(stateResult.error).to.deep.equal(errorMessage);
    });
});

describe('(REDUX) LoginReducer (ACTION) LOGIN_REQUEST', function() {
    it('should return original state', function() {
        expect(loginReducer(initialState(), ACTION_LOGIN_REQUEST)).to.deep.equal(initialState());
    });
});

const ACTION_EMPTY = {};
const ACTION_LOGIN_REQUEST = {"type": "LOGIN_REQUEST"};
const ACTION_LOGIN_RESPONSE = {"type": "LOGIN_RESPONSE"};

function ACTION_LOGIN_ERROR(message) {
    return {
        "type": "LOGIN_ERROR",
        "content": {
            "message": message
        }
    };
}

function initialState() {
    return {
        error: ''
    };
}