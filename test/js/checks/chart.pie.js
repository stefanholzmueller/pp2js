(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator, chart */
    module("check.chart.pie");

    var defaultCheck = { attributes: [12, 12, 12], skill: 4, difficulty: 0, options: { minimumQuality: true, festeMatrix: false, wildeMagie: false, spruchhemmung: false } };

    test("datapoints for descending quality plus failure", function () {
        var data = chart.toPieData(calculator.calculatePartitioned(defaultCheck));
        equal(data[0].dataPoints.length, 5);
        equal(data[0].dataPoints[0].x, 4);
        equal(data[0].dataPoints[3].x, 1);
    });

}());
