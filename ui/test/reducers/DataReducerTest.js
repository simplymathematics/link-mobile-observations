import { expect } from 'chai';
import dataReducer from '../../app/src/scripts/reducers/dataReducer'

import PortOutOrder from '../resources/PortOutOrder.json'
import SummariesOrder from '../resources/SummariesOrder.json'

import { Map, OrderedMap, fromJS } from 'immutable';

import PortInExpectedMapping from "../../app/src/resources/mappings/PortInExpectedMapping.json";
import PortInErrorMapping from "../../app/src/resources/mappings/PortInErrorMapping.json";
import PortOutExpectedMapping from "../../app/src/resources/mappings/PortOutExpectedMapping.json";
import PortOutErrorMapping from "../../app/src/resources/mappings/PortOutErrorMapping.json";
import SubPortExpectedMapping from "../../app/src/resources/mappings/SubPortExpectedMapping.json";
import SubPortErrorMapping from "../../app/src/resources/mappings/SubPortErrorMapping.json";
import ReceivedFileMapping from "../../app/src/resources/mappings/ReceivedFileMapping.json";
import ReceivedFileRecordMapping from "../../app/src/resources/mappings/ReceivedFileRecordMapping.json";
import WrittenFileMapping from "../../app/src/resources/mappings/WrittenFileMapping.json";
import WrittenFileRecordMapping from "../../app/src/resources/mappings/WrittenFileRecordMapping.json";
import ReceivedFileFailureMapping from "../../app/src/resources/mappings/ReceivedFileFailureMapping.json";

describe('(REDUX) DataReducer', function() {
    it('should return state with no modifications if action is not recognised', function() {
        expect(dataReducer(initialState(), ACTION_EMPTY)).to.deep.equal(initialState());
    });

    it('should return initialState if state is undefined', function() {
        expect(dataReducer(undefined, ACTION_EMPTY)).to.deep.equal(initialState());
    });
});

describe('(REDUX) DataReducer (ACTION) POPULATE_ORDERS', function() {
    it('should return state with some order', function() {
        // let initialState = setupInitialState();
        // let action = {
        //     "type": "POPULATE_ORDERS",
        //     "content": {
        //         "orders": PortOutOrder
        //     }
        // };
        //
        // let mutatedInitialState = setupInitialState();
        // mutatedInitialState.orders = PortOutOrder;
        //
        // let result = dataReducer(initialState, action);
        //
        // expect(result).to.deep.equal([]);
    })


});

describe('(REDUX) DataReducer (ACTION) POPULATE_SUMMARIES', function() {
    it('should return state with some order', function() {
        // let mutatedInitialState = initialState();
        // mutatedInitialState._root.entries[2][1] = formatSummaries(SummariesOrder); //ownerId =/= Undefined??
        // expect(result).to.deep.equal(mutatedInitialState);

        //entries[2][1] ==> Summaries in store
        let result = dataReducer(initialState(), ACTION_POPULATE_SUMMARIES);
        expect(result._root.entries[2][1]).to.deep.equal(formatSummaries(SummariesOrder));


    })
});

describe('(REDUX) DataReducer (ACTION) UPDATE_ORDERS', function() {

});

describe('(REDUX) DataReducer (ACTION) REMOVE_ORDERS', function() {

});

describe('(REDUX) DataReducer (ACTION) UPDATE_SUMMARIES', function() {

});

describe('(REDUX) DataReducer (ACTION) CLEAR_ORDERS', function() {

});

describe('(REDUX) DataReducer (ACTION) CLEAR_SUMMARIES', function() {

});

function formatSummaries(summaries) {
   return Map(summaries.map(o => [o.summaryStage, o]));
}

const ACTION_EMPTY = {};

const ACTION_POPULATE_SUMMARIES = {
    "type": "POPULATE_SUMMARIES",
    "content": {
        "summaries": SummariesOrder
    }
};

function initialState() {
    return Map({
        mappings: fromJS({
            portInExpected: PortInExpectedMapping,
            portInErrors: PortInErrorMapping,
            portOutExpected: PortOutExpectedMapping,
            portOutErrors: PortOutErrorMapping,
            subPortExpected: SubPortExpectedMapping,
            subPortErrors: SubPortErrorMapping,
            receivedFiles: ReceivedFileMapping,
            receivedFileRecords: ReceivedFileRecordMapping,
            receivedFileFailure: ReceivedFileFailureMapping,
            writtenFiles: WrittenFileMapping,
            writtenFileRecords: WrittenFileRecordMapping
        }),
        orders: OrderedMap({}),
        summaries: Map({})
    })
}