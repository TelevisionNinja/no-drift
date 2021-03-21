const {
    setNoDriftInterval,
    setNoDriftTimeout,
    clearNoDrift
} = require('./src/nodrift.js');

const {
    setNoDriftZeroInterval,
    setNoDriftZeroTimeout,
    clearNoDriftZero
} = require('./src/nodriftzero.js');

const {
    setNoDriftWorkerInterval,
    setNoDriftWorkerTimeout,
    clearNoDriftWorker
} = require('./src/worker/nodriftworker.js');

module.exports = {
    setNoDriftInterval,
    setNoDriftTimeout,
    clearNoDrift,

    setNoDriftZeroInterval,
    setNoDriftZeroTimeout,
    clearNoDriftZero,

    setNoDriftWorkerInterval,
    setNoDriftWorkerTimeout,
    clearNoDriftWorker
}