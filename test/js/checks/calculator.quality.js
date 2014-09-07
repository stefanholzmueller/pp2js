(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator */
    module("check.calculator.quality");

    test("average quality for all outcomes", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], value: 3, difficulty: 0, options: { minimumQuality: true } });
        equal(result.quality, 0.885125);
    });

    test("average quality for only successes", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], value: 3, difficulty: 0, options: { minimumQuality: true } });
        equal(result.success.quality, 2.249364675984752);
    });

}());