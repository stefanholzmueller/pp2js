"use strict";


function deepFreeze(o) {
    var prop, propKey;
    Object.freeze(o);
    for (propKey in o) {
        prop = o[propKey];
        if (o.hasOwnProperty(propKey) && prop instanceof Object) {
            deepFreeze(prop);
        }
    }
}