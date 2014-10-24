(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator */
    module("check.calculator.probability");

    test("probability of success", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], skill: 3, difficulty: 0, options: { minimumQuality: true } });
        equal(result.success.probability, 0.3935);
    });

}());