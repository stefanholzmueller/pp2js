(function () {
    'use strict';

    /*global module, test, equal, ok, _, evaluator */
    module("evaluator.evaluate.special");


    var defaultOptions = {
        minimumQuality: true,
        festeMatrix: false,
        wildeMagie: false,
        spruchhemmung: false
    };

    var defaultAttributes = [11, 12, 13];


    test("no wilde magie", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 5, 0, [19, 5, 20]);
        equal(outcome.success, false);
    });
    test("no spruchhemmung", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 5, 0, [10, 10, 11]);
        equal(outcome.success, true);
    });


    test("spectacular success", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 3, -2, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 3);
    });

    test("spectacular success, negative value, no minimum quality", function () {
        var outcome = evaluator.evaluate({}, defaultAttributes, -2, -2, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 0);
    });

    test("spectacular success, negative value, minimum quality", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, -2, [1, 1, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
    });

    test("automatic success", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 5, 5, [1, 9, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 5);
    });

    test("automatic success, negative value", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, -2, 5, [1, 9, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 1);
    });

    test("automatic success, negative difficulty", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 3, -5, [1, 9, 1]);
        equal(outcome.success, true);
        equal(outcome.quality, 3);
    });

    test("spectacular failure", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 5, 5, [20, 20, 20]);
        equal(outcome.success, false);
    });

    test("automatic failure", function () {
        var outcome = evaluator.evaluate(defaultOptions, defaultAttributes, 5, 5, [15, 20, 20]);
        equal(outcome.success, false);
    });

    test("spruchhemmung > success", function () {
        var outcome = evaluator.evaluate({spruchhemmung: true}, defaultAttributes, 5, 0, [5, 8, 5]);
        equal(outcome.success, false);
    });

    test("spruchhemmung > failure", function () {
        var outcome = evaluator.evaluate({spruchhemmung: true}, defaultAttributes, 5, 0, [15, 18, 15]);
        equal(outcome.success, false);
    });

    test("automatic success > spruchhemmung", function () {
        var outcome = evaluator.evaluate({spruchhemmung: true}, defaultAttributes, 5, 0, [1, 1, 15]);
        equal(outcome.success, true);
    });

    test("wilde magie", function () {
        var outcome = evaluator.evaluate({wildeMagie: true}, defaultAttributes, 25, 0, [19, 10, 20]);
        equal(outcome.success, false);
    });

    /*
     test("wilde magie > spruchhemmung", function () {
     var outcome = evaluator.evaluate({wildeMagie: true, spruchhemmung: true}, defaultAttributes, 25, 0, [19, 10, 20]);
     equal(outcome.success, false);
     ok(outcome instanceof check.AutomaticFailure);
     });

     test("feste matrix > spruchhemmung", function () {
     var outcome = evaluator.evaluate({festeMatrix: true, spruchhemmung: true}, defaultAttributes, 25, 0, [18, 20, 20]);
     equal(outcome.success, false);
     ok(outcome instanceof check.AutomaticFailure);
     });

     test("spruchhemmung > feste matrix", function () {
     var outcome = evaluator.evaluate({festeMatrix: true, spruchhemmung: true}, defaultAttributes, 25, 0, [17, 20, 20]);
     equal(outcome.success, false);
     ok(outcome instanceof check.SpruchhemmungFailure);
     });

     test("feste matrix > spruchhemmung", function () {
     var outcome = evaluator.evaluate({festeMatrix: true, spruchhemmung: true}, defaultAttributes, 25, 0, [18, 20, 20]);
     equal(outcome.success, false);
     ok(outcome instanceof check.AutomaticFailure);
     });

     test("wilde magie > spruchhemmung", function () {
     var outcome = evaluator.evaluate({wildeMagie: true, spruchhemmung: true}, defaultAttributes, 25, 0, [19, 19, 19]);
     equal(outcome.success, false);
     ok(outcome instanceof check.AutomaticFailure);
     });
     */

}());
