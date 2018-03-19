import { Map, OrderedMap, fromJS } from 'immutable';
import { POPULATE_ORDERS, POPULATE_SUMMARIES, UPDATE_ORDERS, UPDATE_SUMMARIES, CLEAR_ORDERS, CLEAR_SUMMARIES, REMOVE_ORDERS } from '../actions/DataAction';
import PortInDashMapping from "../../resources/mappings/PortInDashMapping.json";
import PortInExpectedMapping from "../../resources/mappings/PortInExpectedMapping.json";
import PortInErrorMapping from "../../resources/mappings/PortInErrorMapping.json";
import PortOutExpectedMapping from "../../resources/mappings/PortOutExpectedMapping.json";
import PortOutErrorMapping from "../../resources/mappings/PortOutErrorMapping.json";
import SubPortExpectedMapping from "../../resources/mappings/SubPortExpectedMapping.json";
import SubPortErrorMapping from "../../resources/mappings/SubPortErrorMapping.json";
import ReceivedFileMapping from "../../resources/mappings/ReceivedFileMapping.json";
import ReceivedFileRecordMapping from "../../resources/mappings/ReceivedFileRecordMapping.json";
import WrittenFileMapping from "../../resources/mappings/WrittenFileMapping.json";
import WrittenFileRecordMapping from "../../resources/mappings/WrittenFileRecordMapping.json";
import ReceivedFileFailureMapping from "../../resources/mappings/ReceivedFileFailureMapping.json";
import {equal} from "../util/Equal";

/*
    Mapping Keys equate to pageTypes received from Back End.
 */
const initialState = Map({
    mappings: fromJS({
        portInDash: PortInDashMapping,
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
});

export default function(state = initialState, action) {
    switch (action.type) {
        case POPULATE_ORDERS:

            // console.log("----")
            // var old = state.get('orders')
            // console.log("orders "+ old + " " + old.size)
            //
            // console.log("oders " + action.content.orders)
            // action.content.orders.forEach(function(a) {
            //     console.log("a" + a)
            // })
            // var newOrders = OrderedMap(action.content.orders.map(
            //     o => [o.ts, o]
            // ))
            // console.log("orders "+  newOrders + " " + newOrders.size)
            //
            // var merged = old.mergeDeep(newOrders)
            //
            // console.log(" new orders " + merged  + " " + merged.size)
            // console.log("----")

            return state.set('orders', state.get('orders').mergeDeep(OrderedMap(action.content.orders.map(
                o => [o.ts+o.id.value, o]
                )
            )));
        case POPULATE_SUMMARIES:
            return state.set('summaries',
                Map(action.content.summaries.map(o =>
                    [o.summaryStage, o])));
        case UPDATE_ORDERS:
            return state.set('orders', state.get('orders').mergeDeep(OrderedMap(action.content.orders.map(
                o => [Object.values(o.entityId).toString(), o]
            )
            )));
        case REMOVE_ORDERS:
            return state.set('orders', state.get('orders').filter(stateOrder => notPresent(stateOrder, action.content.orders)));
        case UPDATE_SUMMARIES:

            return state.set('summaries',
                state.get('summaries').mergeDeep(
                    Map(action.content.summaries.map(o =>
                        [o.summaryStage, o]))));
        case CLEAR_ORDERS:
            return state.set('orders',
                initialState.get('orders'));
        case CLEAR_SUMMARIES:
            return state.set('summaries',
                initialState.get('summaries'));
        default:
            return state;
    }
}

function notPresent(stateOrder, actionOrders) {
    return !actionOrders.filter(actionOrder => equal(actionOrder.entityId, stateOrder.entityId)).length;
}