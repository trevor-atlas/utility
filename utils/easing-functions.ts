// simple linear tweening - no easing, no acceleration
const linearTween = function (time: number, start: number, change: number, duration: number) {
    return change * time / duration + start;
};

// quadratic easing in - accelerating from zero velocity
const easeInQuad = function (time: number, start: number, change: number, duration: number) {
    time /= duration;
    return change * time * time + start;
};

// quadratic easing out - decelerating to zero velocity
const easeOutQuad = function (time: number, start: number, change: number, duration: number) {
    time /= duration;
    return -change * time * (time - 2) + start;
};

// quadratic easing in/out - acceleration until halfway, then deceleration
const easeInOutQuad = function (time: number, start: number, change: number, duration: number) {
    time /= duration / 2;
    if (time < 1) return change / 2 * time * time + start;
    time--;
    return -change / 2 * (time * (time - 2) - 1) + start;
};

// cubic easing in - accelerating from zero velocity
const easeInCubic = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    return c*t*t*t + b;
};

// cubic easing out - decelerating to zero velocity
const easeOutCubic = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    t--;
    return c*(t*t*t + 1) + b;
};

// cubic easing in/out - acceleration until halfway, then deceleration
const easeInOutCubic = function (time: number, start: number, change: number, duration: number) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
};

// quartic easing in - accelerating from zero velocity
const easeInQuart = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    return c*t*t*t*t + b;
};

// quartic easing out - decelerating to zero velocity
const easeOutQuart = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    t--;
    return -c * (t*t*t*t - 1) + b;
};

// quartic easing in/out - acceleration until halfway, then deceleration
const easeInOutQuart = function (time: number, start: number, change: number, duration: number) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t*t + b;
    t -= 2;
    return -c/2 * (t*t*t*t - 2) + b;
};

// quintic easing in - accelerating from zero velocity
const easeInQuint = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    return c*t*t*t*t*t + b;
};

// quintic easing out - decelerating to zero velocity
const easeOutQuint = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    t--;
    return c*(t*t*t*t*t + 1) + b;
};

// quintic easing in/out - acceleration until halfway, then deceleration
const easeInOutQuint = function (time: number, start: number, change: number, duration: number) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t*t*t + 2) + b;
};

// sinusoidal easing in - accelerating from zero velocity
const easeInSine = function (time: number, start: number, change: number, duration: number) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
};

// sinusoidal easing out - decelerating to zero velocity
const easeOutSine = function (time: number, start: number, change: number, duration: number) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
};

// sinusoidal easing in/out - accelerating until halfway, then decelerating
const easeInOutSine = function (time: number, start: number, change: number, duration: number) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};

// exponential easing in - accelerating from zero velocity
const easeInExpo = function (time: number, start: number, change: number, duration: number) {
    return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};

// exponential easing out - decelerating to zero velocity
easeOutExpo = function (time: number, start: number, change: number, duration: number) {
    return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

// exponential easing in/out - accelerating until halfway, then decelerating
const easeInOutExpo = function (time: number, start: number, change: number, duration: number) {
    t /= d/2;
    if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
    t--;
    return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};

// circular easing in - accelerating from zero velocity
const easeInCirc = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    return -c * (Math.sqrt(1 - t*t) - 1) + b;
};

// circular easing out - decelerating to zero velocity
const easeOutCirc = function (time: number, start: number, change: number, duration: number) {
    t /= d;
    t--;
    return c * Math.sqrt(1 - t*t) + b;
};

// circular easing in/out - acceleration until halfway, then deceleration
const easeInOutCirc = function (time: number, start: number, change: number, duration: number) {
    t /= d/2;
    if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    t -= 2;
    return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
};
