import React from 'react';

const FileRecordModal = ({
    name,
    title = "File Records",
    controls,
    children
}) => {
    return (
        <div id={ name } className="modal modal-fixed-footer">
            <div className="modal-header content-container">
                <h5>{ title }</h5>
                <div className="content-controls row">
                    { controls }
                </div>
            </div>
            <div className="modal-content">
                { children }
            </div>
            <div className="modal-footer">
                <a className="modal-action modal-close waves-effect waves-light btn-flat ">Close</a>
            </div>
        </div>
    );
};

export default FileRecordModal;