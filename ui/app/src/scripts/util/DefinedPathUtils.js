function getDefined(obj, path) {
    let pathSegments = path.split('.'),
        i;

    for (i = 0; pathSegments[i]; i++) {
        obj = obj[pathSegments[i]];
    }

    return obj;
}

/**
 * Attempts to retrieve a property from a given object based on a path.
 *
 * If any property in the given path is undefined, returns the provided alternate value instead.
 *
 * @param objParam The object to search for a property in.
 * @param pathParam The path to attempt to retrieve a property from.
 * @param alt The value to return in case of failure.
 * @returns {*}
 */
export function getDefinedOrElse(objParam, pathParam, alt) {
    try {
        let result = getDefined(objParam, pathParam);
        if (typeof result !== "undefined") return result;
    } catch (e) {}
    return alt;
}

/**
 * Attempts to call a given function, passing in a property from the given object based on a path as a parameter.
 *
 * If any property in the given path is undefined, no function will be called.
 *
 * @param objParam The object to search for a property in.
 * @param pathParam The path to attempt to retrieve a property from.
 * @param functionParam The function to call with the found parameter.
 * @returns {*}
 */
export function callFunctionWithParamIfDefined(objParam, pathParam, functionParam) {
    try {
        let result = getDefined(objParam, pathParam);
        if (typeof result !== "undefined") functionParam(result);
    } catch (e) {}
}