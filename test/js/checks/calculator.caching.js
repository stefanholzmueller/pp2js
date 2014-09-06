(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator */
    module("check.calculator.caching");

    test("deterministic ordering by property name", function () {
        var cacheKey = calculator._makeCacheKey({ attributes: [12, 12, 12], value: 4, difficulty: 0 });
        equal(cacheKey, '12|12|12|0|4');
    });

    test("sort attributes, but do not mutate input", function () {
        var originalAttributes = [13, 12, 11],
            cacheKey = calculator._makeCacheKey({ attributes: originalAttributes, value: 4, difficulty: 0 });
        equal(cacheKey, '11|12|13|0|4');
        ok(_.isEqual([13, 12, 11], originalAttributes));
    });

    test("serialize options", function () {
        var cacheKey = calculator._makeCacheKey({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: {b: true, a: false} });
        equal(cacheKey, '12|12|12|0|false|true|4');
    });

}());
