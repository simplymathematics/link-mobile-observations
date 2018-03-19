'use strict';

// import $ from 'jquery';
// window.jQuery = window.$ = $;
import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import * as Actions from '../actions/LoginAction';
import LoginBox from './presentational/LoginBox';
import LoginField from './presentational/LoginField';
import LoginError from './presentational/LoginError';

class LoginForm extends React.Component {

    handleFormSubmit = (values) => {
        this.props.loginUser(values, this.props.successMethod);
    };

    buildError = () => {
        return this.props.loginState.error ?
            <LoginError errorMessage={ this.props.loginState.error }/>
            : ""
    };

    render() {
        let fields = [
            <Field name="username"
                   key="username"
                   type="text"
                   component={LoginField}
                   label="Username"
                   placeholder="e.g. bob.smith"
                   icon="account_circle"
                   required autoFocus/>,
            <Field name="password"
                   key="password"
                   type="password"
                   component={LoginField}
                   label="Password"
                   icon="lock_outline"
                   required/>];
        return (
            <LoginBox
                onSubmitMethod={ this.props.handleSubmit(this.handleFormSubmit) }
                error={ this.buildError() }>
                { fields }
            </LoginBox>
        );
    }
}

function mapStateToProps(state) {
    return {
        loginState: state.login
    }
}

export default connect(mapStateToProps, Actions)(reduxForm({
    form: 'login'
})(LoginForm));