import { expect } from 'chai';
import * as actionCreator from '../../app/src/scripts/actions/JoyrideAction'

describe('(REDUX) JoyrideAction setStepIndex(int)', function() {
    it('should return object with type SET_STEP_INDEX and stepIndex content', function() {
        let stepIndex = 3;
        let action = actionCreator.setStepIndex(stepIndex);

        expect(action).to.deep.equal({
            "type": "SET_STEP_INDEX",
            "content": {
                "stepIndex": stepIndex
            }
        })
    });
});

describe('(REDUX) JoyrideAction addStep(object)', function() {
    it('should return object with type ADD_STEP and step content', function() {
        let step = {"step":"step"};
        let action = actionCreator.addStep(step);

        expect(action).to.deep.equal({
            "type": "ADD_STEP",
            "content": {
                "step": step
            }
        })
    });
});

describe('(REDUX) JoyrideAction clearSteps()', function() {
    it('should return object with CLEAR_STEPS', function() {
        let action = actionCreator.clearSteps();

        expect(action).to.deep.equal({
            "type": "CLEAR_STEPS"
        })
    });
});