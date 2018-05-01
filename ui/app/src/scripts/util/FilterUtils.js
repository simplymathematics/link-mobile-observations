import JsonPath from 'jsonpath';
import { getDefinedOrElse } from './DefinedPathUtils';

export function isCompleted(order, mappingName) {
    return nonReceivedFilesOrderIsCompleted(order, mappingName) || receivedFileRecordsAllProcessedSuccessfully(order);
}

function nonReceivedFilesOrderIsCompleted(order, mappingName) {
    return (orderStatusIsCompleted(order) && mappingTypeIsNot("receivedFiles", mappingName));
}

export function receivedFileRecordsAllProcessedSuccessfully(order) {
    return allRecordsAreSuccessful(order) && noFailedRecords(order);
}

function allRecordsAreSuccessful(order) {
    return JsonPath.query(order, "$.numberOfRecords")[0] === JsonPath.query(order, "$.successfulRecords.length")[0];
}

function noFailedRecords(order) {
    return JsonPath.query(order, "$.failedRecords.length")[0] === 0;
}

export function orderStatusIsCompleted(order) {
    return JsonPath.query(order, "$.status").toString().includes("COMPLETED");
}

function mappingTypeIsNot(page, mappingName) {
    return mappingName !== page;
}

function filterCompleted(shouldShowCompleted, filterTypes, mappingName, order) {
    return (filterTypes.includes("completed") ? shouldShowCompleted : true)
        || !isCompleted(order, mappingName);
}

function filterOutstanding(shouldShowOutstanding, filterTypes, order) {
    return (filterTypes.includes("outstanding") ? shouldShowOutstanding : true)
        || !isOutstanding(order);
}

export function isOutstanding(order) {
    let startOfToday = new Date().setHours(0, 0, 0, 0);

    return (Date.parse(JsonPath.query(order, "$.entityId.portDate")) < startOfToday ||
            Date.parse(JsonPath.query(order, "$.expectedPortDate")) < startOfToday ||
            Date.parse(JsonPath.query(order, "$.recordReceivedAt").toString().replace("[Europe/London]", "")) < startOfToday);
}

function searchFilter(order, tableColumnToOrderMapping, searchString) {
    return tableColumnToOrderMapping.find(mapping =>
            lowerCasePathValue(order, mapping).includes(searchString.toLowerCase())
        ) !== undefined;
}

function lowerCasePathValue(order, mapping) {
    return getDefinedOrElse(order, mapping.get("path").replace(/\$\./, ""), "").toString().toLowerCase();
}

export function orderSelector(state, searchString = "") {
    let mappings = getDataMappingProperty("mappings").from(state).filter(mapping => mapping.get("searchable"));
    let filterTypes = getDataMappingProperty("filterTypes").from(state);

    let filteredOrders = state.data.get("orders").toArray()
        .filter(order => filterCompleted(state.control.shouldShowCompleted, filterTypes, state.control.pageType, order))
        .filter(order => filterOutstanding(state.control.shouldShowOutstanding, filterTypes, order));

    if (searchString && searchString.trim().length && mappings && mappings.size) {
        return filteredOrders.filter(order => searchFilter(order, mappings, searchString.trim()));
    } else {
        return filteredOrders;
    }
}

function getDataMappingProperty(property, type) {
    return {
        from: function(state) {
            return state.data.getIn(["mappings", type ? type : state.control.pageType, property], []);
        }
    }
}

function getDataFromOrderAsArray(state, type, orderId) {
    let recordData = getDefinedOrElse(state.data.get("orders").get(orderId), type, []);
    return Array.isArray(recordData) ? recordData : [recordData];
}

function filterIncompleteOrderRecords(data) {
    return data.filter(order => order.msisdn);
}

export function orderRecordsSelector(state, type, orderId, mappingType, searchString = "") {
    let mappings = getDataMappingProperty("mappings", mappingType).from(state).filter(mapping => mapping.get("searchable"));

    let data = getDataFromOrderAsArray(state, type, orderId);

    if (mappingType === "writtenFileRecords") data = filterIncompleteOrderRecords(data);

    if (searchString && searchString.trim().length && mappings && mappings.size) {
        return data.filter(record => searchFilter(record, mappings, searchString.trim()));
    } else {
        return data;
    }
}