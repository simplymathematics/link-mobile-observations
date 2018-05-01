import React from 'react';

const DropDownContainer = ({
    name,
    label,
    children
}) => {
    return (
        <li>
            <a className="dropdown-button hover" data-hover="true" data-activates={ name }>
                { label } {/*<span className="new badge red" data-badge-caption="outstanding">4</span>*/} <i
                className="material-icons right">arrow_drop_down</i>
            </a>

            <ul id={ name } className="dropdown-content">
                { children }
            </ul>
        </li>
    );
};

export default DropDownContainer;