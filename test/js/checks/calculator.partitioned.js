(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator */
    module("check.calculator.partitioned");

    test("count for success and failure", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: { minimumQuality: true } });
        equal(result.success.count, 3688);
        equal(result.failure.count, 4312);
    });

    test("partitions for success in descending order", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: { minimumQuality: true } });
        equal(result.success.partitions.length, 4);
        equal(result.success.partitions[0].quality, 4);
        equal(result.success.partitions[3].quality, 1);
        equal(result.success.partitions[0].count, 1752);
    });

    test("one more partition without minimumQuality", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: { minimumQuality: false } });
        equal(result.success.partitions.length, 5);
        equal(result.success.partitions[4].quality, 0);
    });

}());