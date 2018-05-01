// import fetch from 'isomorphic-fetch';

export const SET_PAGE_TYPE = 'SET_PAGE_TYPE';

export function setPageType(pageType) {
    return {
        type: SET_PAGE_TYPE,
        content: {
            pageType: pageType
        }
    }
}

export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';

export function setSearchText(searchText) {
    return {
        type: SET_SEARCH_TEXT,
        content: {
            searchText:searchText
        }
    }
}

export const TOGGLE_FILTER_CRITERIA = 'TOGGLE_FILTER_CRITERIA';
export const OUTSTANDING = 'OUTSTANDING';
export const COMPLETED = 'COMPLETED';

export function toggleFilterCriteria(criteria) {
    return {
        type: TOGGLE_FILTER_CRITERIA,
        content: {
            criteria: criteria
        }
    }
}