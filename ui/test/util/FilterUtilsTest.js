import { expect } from 'chai';
import { getDataFromOrderAsArray, orderRecordsSelector } from '../../app/src/scripts/util/FilterUtils';
import receivedFileState from '../resources/ReceivedFileState';
import writtenFileState from '../resources/WrittenFileState';

import receivedFileFailedRecord from '../resources/ReceivedFileFailedRecord';
import searchedReceivedFileFailedRecord from '../resources/SearchedReceivedFileFailedRecord';
import receivedFileFailure from '../resources/ReceivedFileFailure';
import writtenFileRecord from '../resources/WrittenFileRecord';
import writtenFileOrder from '../resources/WrittenFileOrder';

describe('(Function) orderRecordsSelector', function () {
    it('should return received file records of type failedRecords for given Order ID', function () {
        let result = orderRecordsSelector(receivedFileState, "failedRecords", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP");
        expect(result).to.deep.equal(receivedFileFailedRecord);
    });

    it('should return received file records of type failure for given Order ID', function () {
        let result = orderRecordsSelector(receivedFileState, "failure", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1288.RSP");
        expect(result).to.deep.equal(receivedFileFailure);
    });

    it('should return written file records of type records for given Order ID', function () {
        let result = orderRecordsSelector(writtenFileState, "records", "/tmp/nfs/vfuk/vfukmnp01/SK201701121108VF005.REQ,EE");
        expect(result).to.deep.equal(writtenFileRecord);
    });

    it('should return received file records of type failedRecords for given Order ID with results filtered by search criteria', function () {
        let result = orderRecordsSelector(receivedFileState, "failedRecords", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP", "receivedFileRecords", "MANGOES");
        expect(result).to.deep.equal(searchedReceivedFileFailedRecord);
    });

    it('should return received file records of type failedRecords for given Order ID with results filtered by search criteria with non-matching case', function () {
        let result = orderRecordsSelector(receivedFileState, "failedRecords", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP", "receivedFileRecords", "ManGoeS");
        expect(result).to.deep.equal(searchedReceivedFileFailedRecord);
    });

    it('should return received file records of type failedRecords for given Order ID with results filtered by search criteria with extra whitespace', function () {
        let result = orderRecordsSelector(receivedFileState, "failedRecords", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP", "receivedFileRecords", "  MANGOES  ");
        expect(result).to.deep.equal(searchedReceivedFileFailedRecord);
    });

    it('should return no results when search criteria not found', function () {
        let result = orderRecordsSelector(receivedFileState, "failedRecords", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP", "receivedFileRecords", "AVOCADOS");
        expect(result).to.deep.equal([]);
    });

    it('should return no results when searching for a value only found in non-searchable columns', function () {
        let result = orderRecordsSelector(receivedFileState, "failedRecords", "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP", "receivedFileRecords", "TEST_UNSEARCHABLE_FIELD_VALUE");
        expect(result).to.deep.equal([]);
    });

    it('should return empty array if no Order ID provided', function () {
        let result = orderRecordsSelector(writtenFileState, "records", undefined);
        expect(result).to.deep.equal([]);
    });

    it('should return empty array if Order ID is empty', function () {
        let result = orderRecordsSelector(writtenFileState, "records", "");
        expect(result).to.deep.equal([]);
    });

    it('should return empty array if type is not provided', function () {
        let result = orderRecordsSelector(writtenFileState, undefined, "/tmp/nfs/vfuk/vfukmnp01/SK201701121108VF005.REQ,EE");
        expect(result).to.deep.equal([]);
    });

    it('should return all data if type is empty', function () {
        let result = orderRecordsSelector(writtenFileState, "", "/tmp/nfs/vfuk/vfukmnp01/SK201701121108VF005.REQ,EE");
        expect(result).to.deep.equal([writtenFileOrder]);
    });

    it('should return empty array if type is incorrect', function () {
        let result = orderRecordsSelector(writtenFileState, "notActuallyAType", "/tmp/nfs/vfuk/vfukmnp01/SK201701121108VF005.REQ,EE");
        expect(result).to.deep.equal([]);
    });
});

// import portInOrders from '../resources/PortInOrders.json'
// import portInMappings from '../../app/src/resources/mappings/PortInExpectedMapping.json';
//
// describe('(Function) ordersWithFilteredFields', () => {
//     // jsdom();
//     it('returns a list of orders with only specified fields', () => {
//         expect(ordersWithFilteredFields(portInOrders, portInMappings.mappings)).to.equal([{"a": "b"},{"a": "b"},{"a": "b"}]);
//     });
// });

describe('(TIMEBOMB!) Check if next version of Materialize is available (https://github.com/Dogfalo/materialize/milestone/6) to resolve issues with JQuery and Hammer dependencies.', () => {
    it('should be before 01/08/2017', () => {
        expect(new Date()).to.be.below(new Date('2017-08-01T00:00:00'))
    });
});