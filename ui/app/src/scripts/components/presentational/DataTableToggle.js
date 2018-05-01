import React from 'react';

const DataTableToggle = ({
                             id,
                             name,
                             onClick,
                             toggleVal
                         }) => {
    return (
        <a id={ id } className="waves-effect waves-light btn"
           onClick={ onClick }>
            { (toggleVal ? "Hide" : "Show") + " " + name }
        </a>
    );
};

export default DataTableToggle;