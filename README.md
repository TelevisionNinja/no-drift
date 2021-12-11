# no-drift
Reduced drift timeouts and intervals for node.js

Inspired by [driftless](https://github.com/dbkaplun/driftless)

## Usage

```javascript
// import any implementation you want
import {
    // default implementation
    setNoDriftInterval,
    setNoDriftTimeout,
    clearNoDrift,

    // setImmediate implementation
    setNoDriftZeroInterval,
    setNoDriftZeroTimeout,
    clearNoDriftZero,

    // worker thread implementation
    setNoDriftWorkerInterval,
    setNoDriftWorkerTimeout,
    clearNoDriftWorker
} from 'no-drift';

//------------------
// similar usage to setTimeout and setInterval
// all implementations have the same usage

setNoDriftTimeout(() => {
    console.log('Hello world 1');
});

setNoDriftTimeout(() => {
    console.log('Hello world 2');
}, 1000);

setNoDriftTimeout((a, b, c) => {
    console.log(a, b, c);
}, 2000, '1', '2', '3');

setNoDriftTimeout("console.log('Hello world 3');", 3000);

// nodrift intervals have the same usage shown above

//------------------
// clearing nodrift

const id = setNoDriftTimeout(() => {
    console.log('clear');
}, 1000);

clearNoDrift(id);

// each implementation has their own pool of IDs
// so import and use the appropriate clearing function

```

## Formulas for timeout times:

_r_ = rate

_t_ = total time<br /><br />


### Time left

__recurrence relation__

_d_<sub>0</sub> = _t_

_d_<sub>_n_</sub> = (1 - _r_)_d_<sub>_n_-1</sub>

__closed form__

_d_<sub>_n_</sub> = _t_(1 - _r_)<sup>_n_</sup><br /><br />


### Current time

__recurrence relation__

_c_<sub>0</sub> = 0

_c_<sub>_n_</sub> = (1 - _r_)_c_<sub>_n_-1</sub> + _tr_

__closed form__

_c_<sub>_n_</sub> = _t_(1 - (1 - _r_)<sup>_n_</sup>)<br /><br />


### Current wait time

__recurrence relation__

_w_<sub>0</sub> = _tr_

_w_<sub>_n_</sub> = (1 - _r_)_w_<sub>_n_-1</sub>

__closed form__

_w_<sub>_n_</sub> = _tr_(1 - _r_)<sup>_n_</sup>
