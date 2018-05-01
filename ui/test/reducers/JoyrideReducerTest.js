import { expect } from 'chai';
import joyrideReducer from '../../app/src/scripts/reducers/joyrideReducer'

import * as JoyrideMappings from "../../app/src/resources/mappings/joyride";
import joyrideStep from "../resources/JoyrideStep.json";

describe('(REDUX) JoyrideReducer', function() {
    it('should return state with no modifications if action is not recognised', function () {
        expect(joyrideReducer(initialState(), ACTION_EMPTY)).to.deep.equal(initialState());
    });

    it('should return initialState if state is undefined', function () {
        expect(joyrideReducer(undefined, ACTION_EMPTY)).to.deep.equal(initialState());
    });
});

describe('(REDUX) JoyrideReducer (ACTION) SET_STEP_INDEX', function() {
   it('should return state with modified stepIndex', function() {
       let stepIndex = 10052017;

       let mutatedInitialState = initialState();
       mutatedInitialState.stepIndex = stepIndex;

       expect(joyrideReducer(initialState(), ACTION_SET_STEP_INDEX(stepIndex))).to.deep.equals(mutatedInitialState)
   });
});

describe('(REDUX) JoyrideReducer (ACTION) ADD_STEP', function() {
    it('should return state with a joyride step', function() {
        let mutatedInitialState = initialState();
        mutatedInitialState.steps = [joyrideStep];

        expect(joyrideReducer(initialState(), ACTION_ADD_STEP).steps).to.have.lengthOf(1);
        expect(joyrideReducer(initialState(), ACTION_ADD_STEP)).to.deep.equals(mutatedInitialState);
    });
});

describe('(REDUX) JoyrideReducer (ACTION) CLEAR_STEPS', function() {
    it('should populate state with a joyride step and then remove it', function() {
        let mutatedState = joyrideReducer(initialState(), ACTION_ADD_STEP);
        expect(mutatedState.steps).to.have.lengthOf(1);

        mutatedState = joyrideReducer(mutatedState, ACTION_CLEAR_STEP);
        expect(mutatedState.steps).to.have.lengthOf(0);
    });
});

const ACTION_EMPTY = { };

const ACTION_CLEAR_STEP = { "type": "CLEAR_STEPS" }

const ACTION_ADD_STEP = {
    "type": "ADD_STEP",
    "content": {
        "step": joyrideStep
    }
};

function ACTION_SET_STEP_INDEX(stepIndex){
    return {
        "type": "SET_STEP_INDEX",
        "content": {
            "stepIndex": stepIndex
        }
    };
}

function initialState() {
    return {
        steps: [],
        stepIndex: 0,
        stepMapping: JoyrideMappings
    }
}