(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator, chart */
    module("check.chart.bar");

    var colorSuccess = "#108A10",
        colorSuccessLight = "#669666",
        colorFailure = "#BB1010",
        colorFailureLight = "#C55555";

    test("eight difficulties", function () {
        var data = chart.getBarData({ attributes: [12, 12, 12], value: 4, difficulty: 3, options: { minimumQuality: true }});
        equal(data.length, 2);
        equal(data[0].dataPoints.length, 8);
        equal(data[1].dataPoints.length, 8);
    });

    test("seven difficulties", function () {
        var data = chart.getBarData({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: { minimumQuality: true }});
        equal(data.length, 2);
        equal(data[0].dataPoints.length, 7);
        equal(data[1].dataPoints.length, 7);
    });

    test("colors", function () {
        var data = chart.getBarData({ attributes: [12, 12, 12], value: 4, difficulty: -13, options: { minimumQuality: true }});
        equal(data[0].dataPoints[0].color, colorSuccess);
        equal(data[1].dataPoints[0].color, colorFailure);
        equal(data[0].dataPoints[1].color, colorSuccessLight);
        equal(data[1].dataPoints[1].color, colorFailureLight);
    });

    test("difficulties", function () {
        var data = chart.getBarData({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: { minimumQuality: true }});
        equal(data[0].dataPoints[0].y, 7844);
        equal(data[0].dataPoints[0].label, "erleichtert um 12");
        equal(data[1].dataPoints[0].y, 156);
        equal(data[1].dataPoints[0].label, "erleichtert um 12");
    });

}());
