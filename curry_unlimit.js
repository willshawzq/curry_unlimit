"use strict";

var add = (function () {
    var total = function total(args) {
        return Array.slice.call(args).reduce(function (pre, cur) {
            return pre + cur;
        }, 0);
    };
    var factor = function factor(value) {
        var result = function result() {
            return factor(value + total(arguments));
        };
        result.value = value;
        result.valueOf = function () {
            return this.value;
        };
        return result;
    };
    return function () {
        return factor(total(arguments));
    };
})();
