// import fetch from 'isomorphic-fetch';
import { change } from 'redux-form';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';

export function loginRequest() {
    return {
        type: LOGIN_REQUEST
    }
}

export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';

export function loginResponse() {
    return {
        type: LOGIN_RESPONSE
    }
}

export const LOGIN_ERROR = 'LOGIN_ERROR';

export function loginError(error) {
    return {
        type: LOGIN_ERROR,
        content: {
            message: error
        }
    }
}

export function loginUser(values, successMethod = null) {
    return function (dispatch) {
        dispatch(loginRequest());

        let credentials = {
            username: values.get('username').toLowerCase().trim(),
            password: values.get('password').trim()
        };

        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        let fetchParams = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(credentials),
            credentials: 'same-origin'
        };

        return fetch('/login', fetchParams)
            .then(response => response.json().then(json => {
                dispatch(change('login', 'password', ''));
                if (json.success) {
                    dispatch(loginResponse());
                    if (successMethod && typeof(successMethod) === 'function') {
                        successMethod();
                    } else {
                        window.location.replace(json.redirect);
                    }
                }
                else {
                    dispatch(loginError(json.error));
                }
            }))
            .catch(error => dispatch(loginError("Login failed, please try again later.")));
    }
}