(function () {
    'use strict';

    /*global module, test, forAll, _, calculator */
    module("check.calculator.property");

    test("claire", function () {
        forAll(_.Int, _.Int).satisfy(function (a, b) {
            return a + b === b + a;
        }).asTest();
    });

}());
