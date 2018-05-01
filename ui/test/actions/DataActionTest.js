import { expect } from 'chai';
import * as actionCreator from '../../app/src/scripts/actions/DataAction'

let orders = ["order1", "order2", "order3"];

describe('(REDUX) DataAction populateOrders(Array)', function() {
    it('should return object with type POPULATE_ORDERS and orders content', function() {
        let action = actionCreator.populateOrders(orders);
        expect(action).to.deep.equal({
            "type": "POPULATE_ORDERS",
            "content": {
                "orders": orders
            }
        })
    });

    it('should return object with type POPULATE_ORDERS and empty orders content', function() {
        let action = actionCreator.populateOrders([]);
        expect(action).to.deep.equal({
            "type": "POPULATE_ORDERS",
            "content": {
                "orders": []
            }
        })
    });
});

describe('(REDUX) DataAction updateOrders(Array)', function() {
    it('should return object with type UPDATE_ORDERS and orders content', function() {
        let action = actionCreator.updateOrders(orders);
        expect(action).to.deep.equal({
            "type": "UPDATE_ORDERS",
            "content": {
                "orders": orders
            }
        })
    });

    it('should return object with type UPDATE_ORDERS and empty orders content', function() {
        let action = actionCreator.updateOrders([]);
        expect(action).to.deep.equal({
            "type": "UPDATE_ORDERS",
            "content": {
                "orders": []
            }
        })
    });
});

describe('(REDUX) DataAction removeOrders(Array)', function() {
    it('should return object with type REMOVE_ORDERS and orders content', function() {
        let action = actionCreator.removeOrders(orders);
        expect(action).to.deep.equal({
            "type": "REMOVE_ORDERS",
            "content": {
                "orders": orders
            }
        })
    });

    it('should return object with type REMOVE_ORDERS and empty orders content', function() {
        let action = actionCreator.removeOrders([]);
        expect(action).to.deep.equal({
            "type": "REMOVE_ORDERS",
            "content": {
                "orders": []
            }
        })
    });
});

describe('(REDUX) DataAction clearOrders()', function() {
    it('should return object with type CLEAR_ORDERS', function() {
        let action = actionCreator.clearOrders();
        expect(action).to.deep.equal({
            "type": "CLEAR_ORDERS"
        })
    })
});

let summaries = ["summary1", "summary2", "summary3"];

describe('(REDUX) DataAction populateSummaries(Array)', function() {
    it('should return object with type POPULATE_SUMMARIES and summaries content', function() {
        let action = actionCreator.populateSummaries(summaries);
        expect(action).to.deep.equal({
            "type": "POPULATE_SUMMARIES",
            "content": {
                "summaries": summaries
            }
        })
    })
});

describe('(REDUX) DataAction updateSummaries(Array)', function() {
    it('should return object with type UPDATE_SUMMARIES and summaries content', function() {
        let action = actionCreator.updateSummaries(summaries);
        expect(action).to.deep.equal({
            "type": "UPDATE_SUMMARIES",
            "content": {
                "summaries": summaries
            }
        })
    })
});

describe('(REDUX) DataAction clearSummaries()', function() {
    it('should return object with type CLEAR_SUMMARIES', function() {
        let action = actionCreator.clearSummaries()
        expect(action).to.deep.equal({
            "type": "CLEAR_SUMMARIES"
        })
    })
});