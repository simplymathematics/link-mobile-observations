import React from "react";

const DataTableContainer = ({
    id,
    tableHead,
    tableRows
}) => {
    return (
        <table id={ id + "-table" } className="striped highlight responsive-table centered scroll">
            <thead>{tableHead}</thead>
            <tbody>{tableRows}</tbody>
        </table>
    );
};

export default DataTableContainer;