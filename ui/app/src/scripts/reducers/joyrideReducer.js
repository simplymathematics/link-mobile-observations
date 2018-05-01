import Cookies from 'js-cookie';
import { SET_STEP_INDEX, ADD_STEP, CLEAR_STEPS } from '../actions/JoyrideAction';
import * as JoyrideMappings from "../../resources/mappings/joyride";

function filterCompletedGuideSteps(steps) {
    try {
        return steps.filter(step => !JSON.parse(Cookies.get('completedGuideSteps')).includes(step.id));
    } catch (e) {
        return steps;
    }
}

const initialState = {
    steps: [],
    stepIndex: 0,
    stepMapping: JoyrideMappings
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_STEP_INDEX:
            return {
                ...state,
                stepIndex: action.content.stepIndex
            };
        case ADD_STEP:
            return {
                ...state,
                steps: state.steps.concat(filterCompletedGuideSteps([action.content.step]))
            };
        case CLEAR_STEPS:
            return {
                ...state,
                steps: []
            };
        default:
            return state;
    }
}