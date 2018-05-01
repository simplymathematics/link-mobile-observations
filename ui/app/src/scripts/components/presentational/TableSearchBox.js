import React from 'react';

const TableSearchBox = ({
                            input,
                            label,
                            value,
                            placeholder,
                            onChangeMethod
                        }) => {
    return (
        <div className="input-field">
            <i className="material-icons prefix" htmlFor={label}>search</i>
            <input {...input}
                   id={label}
                   value={value}
                   placeholder={placeholder}
                   className={"table-search-input"}
                   type="text"
                   onChange={element => onChangeMethod(element.target.value)}/>
        </div>
    );
};

export default TableSearchBox;