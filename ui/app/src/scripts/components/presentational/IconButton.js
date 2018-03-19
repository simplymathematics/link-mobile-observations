import React from 'react';

const IconButton = ({
                        id,
                        iconType,
                        onClick,
                        tooltip
                    }) => {
    return (
        <a href={ null } className="icon-button" onClick={ onClick }>
            <i id={ id }
               className='small material-icons tooltipped'
               data-position="bottom"
               data-delay="50"
               data-tooltip={ tooltip }>
                { iconType }
            </i>
        </a>
    );
};

export default IconButton;