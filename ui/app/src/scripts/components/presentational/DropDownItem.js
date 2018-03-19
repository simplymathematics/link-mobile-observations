import React from 'react';

const DropDownItem = ({
    name,
    label,
    onClickFunction
}) => {
    return (
        <li>
            <a className={ name } href={ "#" + name }
               onClick={ onClickFunction }>{ label }</a>
        </li>
    );
};

export default DropDownItem;