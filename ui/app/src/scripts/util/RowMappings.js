import $ from "jquery";
import React from "react";
import JsonPath from "jsonpath";
import {isCompleted, isOutstanding} from "./FilterUtils";
import * as Icons from "./TableIcons";
window.jQuery = window.$ = $;
require('materialize-css');
const {Cell} = require('fixed-data-table-2');

function retryEndpoint(pageState) {
    switch(pageState) {
        case "portOutErrors":
            return "/retryPortOut";
        case "portInErrors":
            return "/retryPortIn";
        case "subPortErrors":
            return "/retrySubPort";
        default:
            return "";
    }
}

function sendRetry(entityId, pageState) {
    let jsonStr = JSON.stringify(entityId);
    let endpoint = retryEndpoint(pageState);

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: endpoint,
        dataType: 'json',
        type: 'POST',
        data: jsonStr,
        contentType: "application/json; charset=utf-8",
        success: function() {
            Materialize.toast('Sent retry for MSISDN: ' + entityId.portingMsisdn + '.', 3000); // 3000 is the duration of the toast
        }.bind(this),
        error: function(xhr, status, err) {
            if (xhr.status == 401) {
                $('#loginModal').modal('open');
                $('#username').focus();
            }
            Materialize.toast('Retry was not successful: ' + xhr.responseJSON.error + ".", 3000); // 3000 is the duration of the toast
        }.bind(this)
    });
}

export function mapCell(context, order, cellMapping, data, rowNumber, filterTypes, mappingName) {
    let trClass = [];

    if (filterTypes.includes("outstanding") && isOutstanding(order)) {
        trClass.push("outstanding");
    }

    if (filterTypes.includes("completed") && isCompleted(order, mappingName)) {
        trClass.push("completed");
    }

    let content = cellContent(context, cellMapping, order, rowNumber);

    return <Cell className={trClass.join(" ")} key={cellMapping.displayName + data.rowIndex} {...data}>
        {content}
    </Cell>
}

function isDefinedAndNotEmpty(value) {
    return value !== undefined && value !== "";
}

export function simpleContent(order, mapping) {
    if (mapping.type === "DATE") {
        return formatDateTimeAsDate(getJsonValueAsString(order, mapping.path));
    } else if (mapping.type === "CALCULATED") {
        switch (mapping.displayName) {
            case "Expected":
                return isExpected(order) ? "Yes" : "No";
            case "Confirmed":
                return isConfirmed(order) ? "Yes" : "No";
            case "Error":
                return isError(order) ? "Yes" : "No";
        }
    } else {
        return getDefaultOutput(order, mapping.path);
    }
}

function isExpected(order) {
    let portDate = getJsonValueAsString(order, "$.expectedPortDate");
    return isDefinedAndNotEmpty(portDate) || Date.parse(portDate) === new Date().getDate();
}

function isConfirmed(order) {
    return isDefinedAndNotEmpty(getJsonValueAsString(order, "$.portInSecuredDetails.securedAt"));
}

function isError(order) {
    return checkIsFailure(getJsonValue(order, "$.failures"));
}

function cellContent(context, mapping, order, rowNumber) {
    switch (mapping.displayName) {
        case "Expected":
            return Icons.completedStatusIcon(isExpected(order));
        case "Confirmed":
            return Icons.completedStatusIcon(isConfirmed(order));
        case "Error":
            return Icons.errorStatusIcon(isError(order));
        case "Retry Button":
            return <button onClick={() => sendRetry(getJsonValue(order, "$.entityId")[0], context.props.type)}
                           className="waves-effect waves-light btn">Retry</button>;
        case "Failure Code":
            return getLatestFailure(order).failureCode;
        case "Failure Description":
            return getLatestFailure(order).failureDescription;
        case "Time of Failure":
            return getLatestFailure(order).failedAt;
        case "View Failures":
            if (getJsonValueAsString(order, "$.status") === "REJECTED") {
                return <a key={"viewButton" + rowNumber}
                          className="waves-effect waves-light btn"
                          onClick={() => {
                              initialiseFileRecordModal("#fileRejectedModal");
                              context.props.fileRecordModalInitialiser("failure",
                                  Object.values(order.entityId).toString(), "receivedFileFailure")
                          }}>View</a>
            } else if (getJsonValueAsString(order, "$.failedRecords.length")[0] > 0) {
                return <a key={"viewButton" + rowNumber}
                          className="waves-effect waves-light btn"
                          onClick={() => {
                              initialiseFileRecordModal("#fileRecordModal");
                              context.props.fileRecordModalInitialiser("failedRecords",
                                  Object.values(order.entityId).toString(), "receivedFileRecords")
                          }}>View</a>
            } else {
                return "";
            }
        case "View Records":
            let recordSize = JsonPath.query(order, "$.records.length")[0];
            return (recordSize > 0 && JsonPath.query(order, "$.pendingRecordsCount")[0] < recordSize) ?
                <a key={"viewButton" + rowNumber}
                   className="waves-effect waves-light btn"
                   onClick={() => {
                       initialiseFileRecordModal("#fileRecordModal");
                       context.props.fileRecordModalInitialiser("records",
                           Object.values(order.entityId).toString(), "writtenFileRecords")
                   }}>View</a>
                : "";
        default:
            return simpleContent(order, mapping);
    }
}

function initialiseFileRecordModal(modalId) {
    $(modalId).modal({
        inDuration: 0,
        outDuration: 0
    });
    $(modalId).modal('open');
}

function getDefaultOutput(row, path) {
    return getJsonValueAsString(row, path).replace(/_/g, ' ');
}

function checkIsFailure(failures) {
    if (typeof failures !== 'undefined') return failures[0].length > 0;
    else return false
}

function getLatestFailure(row) {
    let array = getJsonValue(row, "$.failures")[0];

    if (typeof array !== 'undefined') {
        return array ? array[array.length - 1] : {};
    } else {
        return row;
    }
}

function formatDateTimeAsDate(dateTime) {
    return dateTime.split("T")[0]
}

function getJsonValueAsString(row, key) {
    return getJsonValue(row, key).toString();
}

function getJsonValue(row, key) {
    return JsonPath.query(row, key);
}