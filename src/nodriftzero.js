// collection of IDs so that the timers can be cleared
const IDs = new Map();
// variable to keep track of and return a new ID
let newID = 1;

const rate = 0.9;
const threshold = 16; // ms

/**
 * this calls a function to get a timestamp
 * 
 * @returns a timestamp
 */
const getTimestamp = () => performance.now();
/*
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

/**
 * creates a function if the callback is a string
 * 
 * @param {Function} callback 
 * @param {...any} args 
 * @returns 
 */
function createCallback(callback, args) {
    if (typeof callback === 'function') {
        return () => callback(...args);
    }

    return Function(...args, callback);
}

//-------------------------------------------------------------------------
// timeout

/**
 * recursively calls this function to check the time
 * 
 * @param {Function} callback 
 * @param {Number} end 
 * @param {Number} ID 
 */
function zeroTimeout(callback, end, ID) {
    // recursion
    if (0 < end - getTimestamp()) {
        IDs.set(
            ID,
            setTimeout(() => {
                zeroTimeout(callback, end, ID);
            })
        );

        //--------------------

        // IDs.set(
        //     ID,
        //     setImmediate(() => {
        //         zeroTimeout(callback, end, ID);
        //     })
        // );
    }
    else {
        // IDs.set(
        //     ID,
        //     setTimeout(() => {
        //         callback();
        //     })
        // );

        //--------------------

        // IDs.set(
        //     ID,
        //     setImmediate(() => {
        //         callback();
        //     })
        // );

        //--------------------

        callback();

        IDs.delete(ID);
    }

    //--------------------

    // spinning
    // while (0 < end - getTimestamp()) {}

    // callback();
    // IDs.delete(ID);
}

/**
 * recursively calls this function to check the time
 * 
 * @param {Function} callback 
 * @param {Number} time 
 * @param {Number} end 
 * @param {Number} ID 
 */
function zeroInterval(callback, time, end, ID) {
    // recursion
    if (0 < end - getTimestamp()) {
        IDs.set(
            ID,
            setTimeout(() => {
                zeroInterval(callback, time, end, ID);
            })
        );

        //--------------------

        // IDs.set(
        //     ID,
        //     setImmediate(() => {
        //         zeroInterval(callback, time, end, ID);
        //     })
        // );
    }
    else {
        // setTimeout(() => {
        //     callback();
        // });

        //--------------------

        // setImmediate(() => {
        //     callback();
        // });

        //--------------------

        callback();

        customInterval(callback, time, end + time, ID);
    }

    //--------------------

    // spinning
    // while (0 < end - getTimestamp()) {}

    // callback();
    // customInterval(callback, time, end + time, ID);
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
        zeroTimeout(callback, end, ID);
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
export function setNoDriftZeroTimeout(callback, ms = 0, ...args) {
    customTimeout(createCallback(callback, args), ms + getTimestamp(), newID);

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
    const delta = end - getTimestamp();

    if (delta > threshold) {
        IDs.set(
            ID,
            setTimeout(() => {
                customInterval(callback, time, end, ID);
            }, rate * delta)
        );
    }
    else {
        zeroInterval(callback, time, end, ID);
    }
}

/**
 * calls timeout repeatedly
 * 
 * @param {Function} callback 
 * @param {Number} ms 
 * @param  {...any} args 
 * @returns an ID
 */
export function setNoDriftZeroInterval(callback, ms = 0, ...args) {
    customInterval(createCallback(callback, args), ms, ms + getTimestamp(), newID);

    return newID++;
}

//-------------------------------------------------------------------------
// clear function

/**
 * cancels a no drift timeout or interval
 * 
 * @param {Number} ID 
 */
export function clearNoDriftZero(ID) {
    clearTimeout(IDs.get(ID));
    IDs.delete(ID);
}
