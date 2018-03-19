require('testdom')('<html><body><div id="login"></div></body></html>')
import assert from 'assert';
// var rtu = require('react-addons-test-utils');

// login.handlePasswordChange()
// handlePasswordChange: function(e) {
//     this.setState({ password: e.target.value });
// },
//

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
// describe('Login', function() {
//     describe('#handleUsernameChange()', function() {
//         it('should update state', function(done) {
//             var login = require("../login.jsx");
//             var usernameInput = this.refs.username;
//             usernameInput = "Test User";
//             rtu.Simulate.change(usernameInput);
//             assert.equal(this.state.username, "Test User", "Username was not updated.");
//         });
//     });
// });