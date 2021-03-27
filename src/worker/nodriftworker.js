const { Worker } = require('worker_threads');
const { resolve } = require('path');

module.exports = {
    setNoDriftWorkerTimeout,
    setNoDriftWorkerInterval,
    clearNoDriftWorker
}

// collection of callbacks
const callbacks = new Map();
// variable to keep track of and return a new ID
let newID = 1;

/**
 * creates a function if the callback is a string
 * 
 * @param {*} callback 
 * @param {*} args 
 * @returns 
 */
function createCallback(callback, args) {
    if (typeof callback === 'function') {
        return () => callback(...args);
    }

    return Function(...args, callback);
}

const worker = new Worker(resolve(__dirname, './worker.js'));

// execute function
worker.on('message', vars => {
    const {
        type,
        ID
    } = vars;

    const callback = callbacks.get(ID);

    if (callback) {
        callback();

        if (type === 'timeout') {
            clearNoDriftWorker(ID);
        }
    }
});

/**
 * calls timeout until the time has been reached
 * 
 * @param {Function} callback 
 * @param {Number} ms 
 * @param  {...any} args 
 * @returns an ID
 */
 function setNoDriftWorkerTimeout(callback, ms = 0, ...args) {
    callbacks.set(newID, createCallback(callback, args));

    worker.postMessage({
        type: 'timeout',
        time: ms,
        ID: newID
    });

    return newID++;
}

/**
 * calls timeout repeatedly
 * 
 * @param {Function} callback 
 * @param {Number} ms 
 * @param  {...any} args 
 * @returns an ID
 */
 function setNoDriftWorkerInterval(callback, ms = 0, ...args) {
    callbacks.set(newID, createCallback(callback, args));

    worker.postMessage({
        type: 'interval',
        time: ms,
        ID: newID
    });

    return newID++;
}

/**
 * cancels a no drift timeout or interval
 * 
 * @param {Number} ID 
 */
function clearNoDriftWorker(ID) {
    callbacks.delete(ID);

    worker.postMessage({
        type: '',
        time: 0,
        ID: ID
    });
}