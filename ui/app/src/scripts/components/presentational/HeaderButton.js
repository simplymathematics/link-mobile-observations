import React from 'react';

const HeaderButton = ({
    url,
    onClickFunction,
    label
}) => {
    return (
        <li>
            <a href={ url } onClick={ onClickFunction }>{ label }</a>
        </li>
    );
};

export default HeaderButton;