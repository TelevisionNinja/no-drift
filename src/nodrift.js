const { performance } = require('perf_hooks'); // for node js

module.exports = {
    startTimeout,
    startInterval,
    cancelTimeout,
    cancelInterval
}

// array of IDs so that the timers can be cleared
const IDs = new Map();
// variable to keep track of and return a new ID
let newID = 0;

/*
formula for timeout times:

recursive formula (geometric)
t(0) = givenTime
t(n) = (1 / denominator) * t(n - 1)

closed formula
t = givenTime * (1 / denominator)^n

default denominator is 2 
*/
const denominator = 2;

/**
 * this calls a function to get a timestamp
 * performance.now() is the default
 * 
 * @returns a timestamp
 */
function getTimestamp() {
    /*
    other timestamp functions

    -------------------------

    const time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000; // ms

    -------------------------

    return Number(process.hrtime.bigint() / 1000000n); // ms

    -------------------------

    return Date.now();
    */

    return performance.now();
};

//-------------------------------------------------------------------------
// timeout

/**
 * calls timeout until the time has been reached
 * 
 * @param {Function} callback 
 * @param {Number} end 
 * @param {Number} ID 
 */
function customTimeout(callback, end, ID) {
    if (end > getTimestamp()) {
        IDs.set(
            ID,
            setTimeout(() => {
                customTimeout(callback, end, ID);
            }, (end - getTimestamp()) / denominator)
        );
    }
    else {
        callback();
    }
}

/**
 * calls timeout until the time has been reached
 * 
 * @param {Function} callback 
 * @param {Number} ms 
 * @param  {...any} args 
 * @returns an ID
 */
function startTimeout(callback, ms = 0, ...args) {
    customTimeout(() => {
        callback(...args);
    }, ms + getTimestamp(), newID);

    return newID++;
}

//-------------------------------------------------------------------------
// interval

/**
 * calls timeout repeatedly
 * 
 * @param {Function} callback 
 * @param {Number} time 
 * @param {Number} end 
 * @param {Number} ID 
 */
function customInterval(callback, time, end, ID) {
    if (end <= getTimestamp()) {
        callback();
        end += time;
    }

    IDs.set(
        ID,
        setTimeout(() => {
            customInterval(callback, time, end, ID);
        }, (end - getTimestamp()) / denominator)
    );
}

/**
 * calls timeout repeatedly
 * 
 * @param {Function} callback 
 * @param {Number} ms 
 * @param  {...any} args 
 * @returns an ID
 */
function startInterval(callback, ms = 0, ...args) {
    customInterval(() => {
        callback(...args);
    }, ms, ms + getTimestamp(), newID);

    return newID++;
}

//-------------------------------------------------------------------------
// clear functions

/**
 * cancels the timeout of a given ID
 * 
 * @param {Number} ID 
 */
function cancelTimeout(ID) {
    clearTimeout(IDs.get(ID));
    IDs.delete(ID);
}

/**
 * cancels the interval of a given ID
 * 
 * @param {Number} ID 
 */
function cancelInterval(ID) {
    clearInterval(IDs.get(ID));
    IDs.delete(ID);
}