(function () {
    'use strict';

    var module = angular.module('pp2.utils', []);

    module.filter('percentage', [
        '$filter', function (filter) {
            return function (number, fractionSize) {
                var decimals = fractionSize || 4,
                    percent = Math.round(number * Math.pow(10, decimals + 2)) / Math.pow(10, decimals);
                return filter('number')(percent, fractionSize) + "%";
            };
        }]);

    module.filter('signed', function () {
        return function (number) {
            return (number >= 0 ? "+" : "") + number;
        };
    });
}());
