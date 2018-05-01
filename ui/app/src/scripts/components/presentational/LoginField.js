import React from 'react';

const LoginField = ({
    input, label, type,
    placeholder, icon,
    required, autoFocus
}) => {
    return (
        <div className="input-field">
            <i className="material-icons prefix" htmlFor={label}>{icon}</i>
            <input {...input}
                placeholder={placeholder}
                className={"login-form-input validate " + label.toLowerCase()}
                type={type}
                required={required}
                autoFocus={autoFocus}/>
            <label htmlFor={label} className="activeLoginLabel">{label}</label>
        </div>
    );
};

export default LoginField;