import { SET_PAGE_TYPE, TOGGLE_FILTER_CRITERIA, COMPLETED, OUTSTANDING, SET_SEARCH_TEXT } from '../actions/ControlAction';

const initialState = {
    pageType: '',
    searchText: '',
    shouldShowCompleted: false,
    shouldShowOutstanding: true
};

function toggleFilterCriteria(state, criteria) {
    switch (criteria) {
        case COMPLETED:
            return {
                ...state,
                shouldShowCompleted: !state.shouldShowCompleted
            };
        case OUTSTANDING:
            return {
                ...state,
                shouldShowOutstanding: !state.shouldShowOutstanding
            };
        default:
            return state;
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PAGE_TYPE:
            return {
                ...state,
                pageType: action.content.pageType
            };
        case SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.content.searchText
            };
        case TOGGLE_FILTER_CRITERIA:
            return toggleFilterCriteria(state, action.content.criteria);
        default:
            return state;
    }
}