(function (factory) {
    // The below code are based from https://github.com/melanke/Watch.JS

    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD.
        define('CrepeStore', [], factory);
    } else {
        // Browser globals
        window.CrepeStore = factory();
    }
})(require('./crepestore'));
