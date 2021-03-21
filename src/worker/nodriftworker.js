const { Worker } = require('worker_threads');
const path = require('path');

module.exports = {
    setNoDriftWorkerTimeout,
    setNoDriftWorkerInterval,
    clearNoDriftWorker
}

// collection of callbacks
const callbacks = new Map();
// variable to keep track of and return a new ID
let newID = 1;

const worker = new Worker(path.resolve(__dirname,'./worker.js'));

// execute function
worker.on('message', vars => {
    const {
        type,
        ID
    } = vars;

    const func = callbacks.get(ID);

    if (func) {
        func();

        if (type === 'timeout') {
            callbacks.delete(ID);
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
    callbacks.set(newID, () => callback(...args));

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
    callbacks.set(newID, () => callback(...args));

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