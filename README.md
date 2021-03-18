# no-drift-js
Reduced drift timeouts and intervals

Inspired by [driftless](https://github.com/dbkaplun/driftless)

## Formulas for timeout times:

_r_ = rate

_t_ = final time


### Time left

__recursive formula__

_d_<sub>0</sub> = _t_

_d_<sub>n</sub> = (1 - _r_)_d_<sub>n-1</sub>

__closed formula__

_d_<sub>n</sub> = _t_(1 - _r_)<sup>n</sup>


### Current time

__closed formula__

_c_<sub>n</sub> = _t_(1 - (1 - _r_)<sup>n</sup>)


### Current wait time

__closed formula__

_w_<sub>n</sub> = _tr_(1 - _r_)<sup>n</sup>