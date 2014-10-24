(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator */
    module("check.calculator.special");

    test("spectacular successes", function () {
        var result = calculator.calculatePartitioned({ attributes: [11, 11, 11], skill: 0, difficulty: 13, options: { minimumQuality: true } });
        equal(result.success.count, 58);
    });

    test("spectacular failures", function () {
        var result = calculator.calculatePartitioned({ attributes: [20, 20, 20], skill: 0, difficulty: 0, options: { minimumQuality: true } });
        equal(result.failure.count, 58);
    });

    test("spectacular failures with festeMatrix", function () {
        var result = calculator.calculatePartitioned({ attributes: [20, 20, 20], skill: 0, difficulty: 0, options: { minimumQuality: true, festeMatrix: true } });
        equal(result.failure.count, 7);
    });

    test("spectacular failures with wildeMagie", function () {
        var result = calculator.calculatePartitioned({ attributes: [20, 20, 20], skill: 0, difficulty: 0, options: { minimumQuality: true, wildeMagie: true } });
        equal(result.failure.count, 224);
    });

    test("spruchhemmung causes high failure rate even with high skill", function () {
        var result = calculator.calculatePartitioned({ attributes: [20, 20, 20], skill: 0, difficulty: 0, options: { minimumQuality: true, spruchhemmung: true } });
        equal(result.failure.count, 1102);
    });


}());