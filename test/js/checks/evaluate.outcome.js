(function () {
    'use strict';

    /*global module, test, equal, ok, _, evaluator */
    module("evaluator.evaluate.outcome");


    var defaultAttributes = [11, 12, 13],
        defaultOptions = {
            minimumQuality: true,
            festeMatrix: false,
            wildeMagie: false,
            spruchhemmung: false
        },
        withoutMinimumQuality = {
            minimumQuality: false,
            festeMatrix: false,
            wildeMagie: false,
            spruchhemmung: false
        };

    test("exact match", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 0, 0, [11, 12, 13]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
        equal(outcome.gap, 0);
    });

    test("success gap", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 0, 0, [10, 10, 10]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
        equal(outcome.gap, 1);
    });

    test("failure gap", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 0, 0, [15, 15, 15]);
        equal(outcome.success, false);
        equal(outcome.gap, 9);
    });

    test("failure partial gap", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 0, 0, [5, 10, 15]);
        equal(outcome.success, false);
        equal(outcome.gap, 2);
    });

    test("success with value = difficulty", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 4, 4, [10, 10, 10]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
        equal(outcome.gap, 1);
    });

    test("success with negative value = difficulty", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, -2, -2, [11, 12, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
        equal(outcome.gap, 0);
    });

    test("failure with negative value = difficulty", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, -2, -2, [11, 12, 16]);
        equal(outcome.success, false);
        equal(outcome.gap, 3);
    });

    test("minimum quality", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 0, 0, [11, 12, 13]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
        equal(outcome.gap, 0);
    });

    test("minimum quality with negative value", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, 0, [5, 5, 5]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
    });

    test("minimum quality with value = difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 4, 4, [10, 10, 10]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
    });

    test("minimum quality with negative value = difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, -2, [11, 12, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
    });

    test("minimum quality with negative value", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, 0, [1, 10, 10]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
        equal(outcome.gap, 0);
    });

    test("failure with negative value", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, 0, [10, 10, 10]);
        equal(outcome.success, false);
        equal(outcome.gap, 1);
    });

    test("failure with negative value and exceeding die", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, 0, [10, 15, 10]);
        equal(outcome.success, false);
        equal(outcome.gap, 6);
    });

    test("failure with negative value and difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, 2, [10, 9, 7]);
        equal(outcome.success, false);
        equal(outcome.gap, 4);
    });

    test("failure with zero value and difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 0, 4, [10, 10, 8]);
        equal(outcome.success, false);
        equal(outcome.gap, 5);
    });

    test("failure with difficulty > value and high gap", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 3, 8, [14, 3, 18]);
        equal(outcome.success, false);
        equal(outcome.gap, 18);
    });

    test("failure with easy check", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 10, -10, [19, 19, 19]);
        equal(outcome.success, false);
        equal(outcome.gap, 1);
    });

    test("success with difficulty > value", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 3, 8, [4, 3, 5]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
        equal(outcome.gap, 2);
    });

    test("no quality and gap with difficulty > value", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 2, 9, [4, 5, 6]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
        equal(outcome.gap, 0);
    });

    test("no quality but gap with difficulty > value", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 2, 6, [4, 5, 6]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
        equal(outcome.gap, 3);
    });

    test("full quality", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 6, 0, [7, 3, 6]);
        equal(outcome.success, true);
        equal(outcome.quality, 6);
        equal(outcome.gap, 10);
    });

    test("partial quality", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 6, 0, [13, 3, 6]);
        equal(outcome.success, true);
        equal(outcome.quality, 4);
        equal(outcome.gap, 4);
    });

    test("partial gap", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 20, -10, [13, 12, 11]);
        equal(outcome.success, true);
        equal(outcome.quality, 20);
        equal(outcome.gap, 28);
    });

    test("quality = gap", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 20, -10, [16, 16, 16]);
        equal(outcome.success, true);
        equal(outcome.quality, 18);
        equal(outcome.gap, 18);
    });

    test("spectacular success with full quality", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, 4, 0, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 4);
    });

    test("spectacular success with negative points", function () {
        var outcome = evaluator.evaluate(withoutMinimumQuality, defaultAttributes, -2, -5, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
    });

    test("spectacular success with negative points and minimum quality", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, -5, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
    });

    test("automatic success with negative difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 3, -5, [1, 9, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 3);
    });

    test("automatic success with positive difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 20, 10, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 20);
    });

}());
