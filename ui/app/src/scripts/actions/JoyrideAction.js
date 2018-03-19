export const SET_STEP_INDEX = 'SET_STEP_INDEX';

export function setStepIndex(stepIndex) {
    return {
        type: SET_STEP_INDEX,
        content: {
            stepIndex: stepIndex
        }
    }
}

export const ADD_STEP = 'ADD_STEP';

export function addStep(step) {
    return {
        type: ADD_STEP,
        content: {
            step: step
        }
    }
}

export const CLEAR_STEPS = 'CLEAR_STEPS';

export function clearSteps() {
    return {
        type: CLEAR_STEPS
    }
}