import React from 'react';

const CountBox = ({
                            label,
                            value
                        }) => {
    return (
        <div className="input-field right">
                {label + ": " + value}
        </div>
    );
};

export default CountBox;