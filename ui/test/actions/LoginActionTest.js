import { expect } from 'chai';
import * as actionCreator from '../../app/src/scripts/actions/LoginAction'

describe('(REDUX) LoginAction loginRequest()', function() {
    it('should return object with type LOGIN_REQUEST', function() {
        let action = actionCreator.loginRequest();
        expect(action).to.deep.equal({"type": "LOGIN_REQUEST"})
    });
});

describe('(REDUX) LoginAction loginResponse()', function() {
    it('should return object with type LOGIN_RESPONSE', function() {
        let action = actionCreator.loginResponse();
        expect(action).to.deep.equal({"type": "LOGIN_RESPONSE"})
    });
});

describe('(REDUX) LoginAction loginError(string)', function() {
    it('should return object with type LOGIN_ERROR and error message content', function() {
        let errorMessage = "Oh no error message!";
        let action = actionCreator.loginError(errorMessage);

        expect(action).to.deep.equal({"type": "LOGIN_ERROR", "content": { "message": errorMessage}})
    });
});

describe('(REDUX) LoginAction loginUser(Object)', function() {
    it('(Function) loginUser() should successfully send login to backend', function() {
        // let values = {"username": "123", "password":"123"};
        // let action = actionCreator.loginUser(values);
        //
        // //returns [Function] -> [Promise]?
        //
        // //reduxForm.handleSubmit(values)??
        // //returns function(dispatch) -> dispatch(something)
        // //how to test dispatches -> Jasmine
        //
        // expect(action).to.be.equal("");
    })
});



