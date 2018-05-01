import { expect } from 'chai';
import controlReducer from '../../app/src/scripts/reducers/controlReducer'
import * as actionType from '../../app/src/scripts/actions/ControlAction'

describe('(REDUX) controlReducer', function() {
    it('should return state with no modifications if action is not recognised', function () {
        expect(controlReducer(initialState(), ACTION_EMPTY)).to.deep.equal(initialState());
    });

    it('should return initialState if state is undefined', function () {
        expect(controlReducer(undefined, ACTION_EMPTY)).to.deep.equal(initialState());
    });
});

describe('(REDUX) controlReducer (ACTION) dataReducer', function() {

    /*
     add a test to show coping of multiple toggles simultaneously ?
     */

    it('should return initialState if toggle criteria is not recognised ', function() {
        expect(controlReducer(initialState(), ACTION_TOGGLE_FILTER_CRITERIA("BLAH%$!£!£$"))).to.deep.equal(initialState());
    });

    it('should return initialState with shouldShowCompleted toggled (false to true)', function() {
        let mutatedInitialState = initialState();
        mutatedInitialState.shouldShowCompleted = !mutatedInitialState.shouldShowCompleted

        expect(controlReducer(initialState(), ACTION_TOGGLE_FILTER_CRITERIA(actionType.COMPLETED))).to.deep.equal(mutatedInitialState);
    });

    it('should return initialState with shouldShowOutstanding toggled (true to false)', function() {
        let mutatedInitialState = initialState();
        mutatedInitialState.shouldShowOutstanding = !mutatedInitialState.shouldShowOutstanding

        expect(controlReducer(initialState(), ACTION_TOGGLE_FILTER_CRITERIA(actionType.OUTSTANDING))).to.deep.equal(mutatedInitialState);
    });
});

describe('(REDUX) controlReducer (ACTION) togglePageType', function() {
    it('should return initialState with mutated PageType equalling PortIn ', function() {
        let mutatedInitialState = initialState();
        mutatedInitialState.pageType = "PortIn";

        expect(controlReducer(initialState(), ACTION_SET_PAGE_TYPE("PortIn"))).to.deep.equal(mutatedInitialState);
    });
});

describe('(REDUX) controlReducer (ACTION) setSearchText', function() {
    it('should return state with updated Search Text equalling Mango ', function() {
        let mutatedInitialState = initialState();
        mutatedInitialState.searchText = "Mango";

        expect(controlReducer(initialState(), actionType.setSearchText("Mango"))).to.deep.equal(mutatedInitialState);
    });
});

const ACTION_EMPTY = {};

function ACTION_SET_PAGE_TYPE(pageType) {
   return {
        "type": "SET_PAGE_TYPE",
        "content": {
            "pageType": pageType
        }
    }
}

function ACTION_TOGGLE_FILTER_CRITERIA(criteria) {
    return {
        "type": "TOGGLE_FILTER_CRITERIA",
        "content":{
            "criteria": criteria
        }
    }
}

function initialState() {
    return {
        pageType: '',
        searchText: "",
        shouldShowCompleted: false,
        shouldShowOutstanding: true
    }
}
