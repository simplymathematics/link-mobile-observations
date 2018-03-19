// import fetch from 'isomorphic-fetch';

export const POPULATE_ORDERS = 'POPULATE_ORDERS';

export function populateOrders(orders) {
    // console.log("orders "+ orders)
    return {
        type: POPULATE_ORDERS,
        content: {
            orders: orders
        }
    }
}

export const UPDATE_ORDERS = 'UPDATE_ORDERS';

export function updateOrders(orders) {
    return {
        type: UPDATE_ORDERS,
        content: {
            orders: orders
        }
    }
}

export const REMOVE_ORDERS = 'REMOVE_ORDERS';

export function removeOrders(orders) {
    return {
        type: REMOVE_ORDERS,
        content: {
            orders: orders
        }
    }
}

export const CLEAR_ORDERS = 'CLEAR_ORDERS';

export function clearOrders() {
    return {
        type: CLEAR_ORDERS
    }
}

export const POPULATE_SUMMARIES = 'POPULATE_SUMMARIES';

export function populateSummaries(summaries) {
    return {
        type: POPULATE_SUMMARIES,
        content: {
            summaries: summaries
        }
    }
}

export const UPDATE_SUMMARIES = 'UPDATE_SUMMARIES';

export function updateSummaries(summaries) {
    return {
        type: UPDATE_SUMMARIES,
        content: {
            summaries: summaries
        }
    }
}

export const CLEAR_SUMMARIES = 'CLEAR_SUMMARIES';

export function clearSummaries() {
    return {
        type: CLEAR_SUMMARIES
    }
}