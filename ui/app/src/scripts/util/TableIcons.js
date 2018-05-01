'use strict';

import React from "react";

export function completedStatusIcon(isComplete) {
    return isComplete ? <i className="material-icons  green-text">done</i> : <i className="material-icons  red-text text-darken-4">close</i>;
}

export function errorStatusIcon(isError) {
    return isError ? <i className="material-icons  red-text text-darken-4">error_outline</i> : "";
}