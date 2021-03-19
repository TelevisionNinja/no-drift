const { performance } = require('perf_hooks'); // for node js

module.exports = {
    setNoDriftTimeout,
    setNoDriftInterval,
    clearNoDrift
}

// array of IDs so that the timers can be cleared
const IDs = new Map();
// variable to keep track of and return a new ID
let newID = 1;

const rate = 0.9;
const threshold = 16;

/**
 * this calls a function to get a timestamp
 * 
 * @returns a timestamp
 */
const getTimestamp = () => performance.now();
/*
    performance.now() is the default

    other timestamp functions

    -------------------------

    {
        const time = process.hrtime();
        return time[0] * 1000 + time[1] / 1000000; // ms
    }

    -------------------------

    Number(process.hrtime.bigint() / 1000000n); // ms

    -------------------------

    Date.now();
*/

//-------------------------------------------------------------------------
// timeout

/**
 * recursively call function to check time
 * 
 * @param {Function} callback 
 * @param {Number} end 
 */
function zeroTimeout(callback, end) {
    // recursion
    /*
    if (0 < end - getTimestamp()) {
        process.nextTick(() => {
            zeroTimeout(callback, end);
        });

        //--------------------

        setImmediate(() => {
            zeroTimeout(callback, end);
        });
    }
    else {
        process.nextTick(() => {
            callback();
        });

        //--------------------

        setImmediate(() => {
            callback();
        });

        //--------------------

        callback();
    }
    */
    
    // spinning
    while (0 < end - getTimestamp()) {}

    callback();
}

/**
 * calls timeout until the time has been reached
 * 
 * @param {Function} callback 
 * @param {Number} end 
 * @param {Number} ID 
 */
function customTimeout(callback, end, ID) {
    const delta = end - getTimestamp();

    if (delta > threshold) {
        IDs.set(
            ID,
            setTimeout(() => {
                customTimeout(callback, end, ID);
            }, rate * delta)
        );
    }
    else {
        zeroTimeout(callback, end);
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
function setNoDriftTimeout(callback, ms = 0, ...args) {
    customTimeout(() => callback(...args), ms + getTimestamp(), newID);

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
    let delta = end - getTimestamp();

    if (delta <= threshold) {
        zeroTimeout(callback, end);
        end += time;
        delta += time;
    }

    IDs.set(
        ID,
        setTimeout(() => {
            customInterval(callback, time, end, ID);
        }, rate * delta)
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
function setNoDriftInterval(callback, ms = 0, ...args) {
    customInterval(() => callback(...args), ms, ms + getTimestamp(), newID);

    return newID++;
}

//-------------------------------------------------------------------------
// clear function

/**
 * cancels a no drift timeout or interval
 * 
 * @param {Number} ID 
 */
function clearNoDrift(ID) {
    clearTimeout(IDs.get(ID));
    IDs.delete(ID);
}
