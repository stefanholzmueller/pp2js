(function () {
    'use strict';

    /*global module, test, equal, ok, _, evaluator */
    module("evaluator.evaluate.scenario");


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

    function assertFailure(result, gap) {
        equal(result.success, false);
        equal(result.gap, gap);
    }

    function assertSuccess(result, quality, gap) {
        equal(result.success, true);
        equal(result.quality, quality);
        equal(result.gap, gap);
    }

    test("zero value, zero difficulty", function () {
        var partial = _.partial(evaluator.evaluate, defaultOptions, defaultAttributes, 0, 0);
        assertSuccess(partial([5, 6, 3]), 1, 6);
        assertSuccess(partial([11, 11, 8]), 1, 0);
        assertFailure(partial([11, 13, 8]), 1);
        assertFailure(partial([14, 13, 12]), 4);
        assertFailure(partial([4, 2, 20]), 7);
    });

    test("negative value, zero difficulty", function () {
        var partial = _.partial(evaluator.evaluate, defaultOptions, defaultAttributes, -3, 0);
        assertSuccess(partial([5, 5, 5]), 1, 3);
        assertSuccess(partial([1, 9, 10]), 1, 0);
        assertFailure(partial([2, 10, 4]), 1);
        assertFailure(partial([11, 12, 13]), 9);
        assertFailure(partial([4, 2, 20]), 10);
    });

    test("positive value, zero difficulty", function () {
        var partial = _.partial(evaluator.evaluate, defaultOptions, defaultAttributes, 4, 0);
        assertSuccess(partial([5, 5, 5]), 4, 4 + 6);
        assertSuccess(partial([1, 9, 10]), 4, 4 + 3);
        assertSuccess(partial([11, 10, 4]), 4, 4);
        assertSuccess(partial([12, 13, 14]), 1, 1);
        assertSuccess(partial([15, 5, 5]), 1, 0);
        assertFailure(partial([4, 2, 20]), 3);
        assertFailure(partial([14, 14, 13]), 1);
    });


    test("huge value, zero difficulty", function () {
        var partial = _.partial(evaluator.evaluate, defaultOptions, defaultAttributes, 24, 0);
        assertSuccess(partial([5, 5, 5]), 24, 24 + 6);
        assertSuccess(partial([11, 10, 4]), 24, 24);
        assertSuccess(partial([15, 13, 16]), 16, 16);
        assertSuccess(partial([19, 18, 13]), 10, 10);
    });


    /*
     @Test
     def
     scenario_noPoints_smallDifficulty
     {
     val
     partial = OutcomeCalculator.examine(defaultOptions, defaultAttributes, 0, 2)
     _
     assertSuccess(partial([5, 5, 5]),  1, 4);
     assertSuccess(partial([6, 8, 11]),  1, 0);
     assertFailure(partial([10, 11, 4]),  2);
     assertFailure(partial([4, 3, 18]),  7);
     }

     @Test
     def
     scenario_noPoints_negativeDifficulty
     {
     val
     partial = OutcomeCalculator.examine(defaultOptions, defaultAttributes, 0, -5)
     _
     assertSuccess(partial([5, 5, 5]),  1, 11);
     assertSuccess(partial([16, 8, 11]),  1, 0);
     assertFailure(partial([10, 19, 4]),  2);
     assertFailure(partial([18, 18, 18]),  13);
     }

     @Test
     def
     scenario_negativePoints_smallerNegativeDifficulty
     {
     val
     partial = OutcomeCalculator.examine(defaultOptions, defaultAttributes, -3, -5)
     _
     Assert.assertEquals(partial(new Dice(5, 5, 5)), Success(1, 6 + 2))
     assertSuccess(partial([7, 13, 11]),  1, 1);
     assertSuccess(partial([7, 14, 11]),  1, 0);
     assertFailure(partial([7, 15, 11]),  1);
     assertFailure(partial([7, 15, 15]),  3);
     }

     @Test
     def
     scenario_negativePoints_biggerNegativeDifficulty
     {
     val
     partial = OutcomeCalculator.examine(defaultOptions, defaultAttributes, -3, -1)
     _
     assertSuccess(partial([5, 5, 5]),  1, 4);
     assertSuccess(partial([7, 10, 11]),  1, 0);
     assertFailure(partial([7, 11, 11]),  1);
     assertFailure(partial([7, 15, 15]),  9);
     }

     @Test
     def
     scenario_smallPoints_negativeDifficulty
     {
     val
     partial = OutcomeCalculator.examine(defaultOptions, defaultAttributes, 2, -5)
     _
     Assert.assertEquals(partial(new Dice(5, 5, 5)), Success(2, 2 + 5 + 6))
     Assert.assertEquals(partial(new Dice(5, 7, 5)), Success(2, 2 + 5 + 5))
     Assert.assertEquals(partial(new Dice(5, 8, 5)), Success(2, 2 + 5 + 4))
     Assert.assertEquals(partial(new Dice(5, 9, 5)), Success(2, 2 + 5 + 3))
     Assert.assertEquals(partial(new Dice(5, 10, 5)), Success(2, 2 + 5 + 2))
     Assert.assertEquals(partial(new Dice(5, 11, 5)), Success(2, 2 + 5 + 1))
     Assert.assertEquals(partial(new Dice(5, 12, 5)), Success(2, 2 + 5 + 0))
     Assert.assertEquals(partial(new Dice(5, 13, 5)), Success(2, 2 + 4 + 0))
     Assert.assertEquals(partial(new Dice(5, 14, 5)), Success(2, 2 + 3 + 0))
     Assert.assertEquals(partial(new Dice(5, 15, 5)), Success(2, 2 + 2 + 0))
     Assert.assertEquals(partial(new Dice(5, 16, 5)), Success(2, 2 + 1 + 0))
     Assert.assertEquals(partial(new Dice(5, 17, 5)), Success(2, 2 + 0 + 0))
     Assert.assertEquals(partial(new Dice(5, 18, 5)), Success(1, 1 + 0 + 0))
     Assert.assertEquals(partial(new Dice(5, 19, 5)), Success(1, 0 + 0 + 0))
     assertFailure(partial([5, 20, 5]),  1);
     Assert.assertEquals(partial(new Dice(7, 15, 11)), Success(2, 2 + 2))
     Assert.assertEquals(partial(new Dice(7, 15, 15)), Success(2, 2 + 0))
     assertSuccess(partial([7, 15, 16]),  1, 1);
     assertSuccess(partial([7, 15, 17]),  1, 0);
     assertFailure(partial([7, 15, 18]),  1);
     assertFailure(partial([17, 15, 18]),  7);
     }

     @Test
     def
     scenario_smallPoints_smallerDifficulty
     {
     val
     partial = OutcomeCalculator.examine(defaultOptions, defaultAttributes, 4, 3)
     _
     Assert.assertEquals(partial(new Dice(5, 5, 5)), Success(1, 1 + 6))
     assertSuccess(partial([11, 12, 12]),  1, 1);
     assertSuccess(partial([12, 12, 12]),  1, 0);
     assertFailure(partial([13, 12, 12]),  1);
     assertFailure(partial([17, 15, 18]),  13);
     }

     @Test
     def
     scenario_smallPoints_biggerDifficulty
     {
     val
     partial = OutcomeCalculator.examine(withoutMinimumQuality, defaultAttributes, 4, 7)
     _
     assertSuccess(partial([5, 5, 5]),  0, 3);
     assertSuccess(partial([8, 9, 4]),  0, 0);
     assertFailure(partial([8, 10, 4]),  1);
     assertFailure(partial([12, 12, 12]),  9);
     }

     @Test
     def
     scenario_hugePoints_smallerDifficulty
     {
     val
     partial = OutcomeCalculator.examine(withoutMinimumQuality, defaultAttributes, 16, 11)
     _
     Assert.assertEquals(partial(new Dice(5, 5, 5)), Success(5, 5 + 6))
     assertSuccess(partial([14, 13, 12]),  1, 1);
     assertSuccess(partial([14, 13, 14]),  0, 0);
     assertFailure(partial([14, 14, 14]),  1);
     assertFailure(partial([14, 20, 19]),  12);
     }

     @Test
     def
     scenario_extremeAttributes_smallerDifficulty
     {
     val
     partial = OutcomeCalculator.examine(withoutMinimumQuality, List(25, 13, 23), 9, 3)
     _
     Assert.assertEquals(partial(new Dice(6, 12, 16)), Success(6, 6 + 1))
     Assert.assertEquals(partial(new Dice(6, 13, 16)), Success(6, 6 + 0))
     assertSuccess(partial([6, 14, 16]),  5, 5);
     assertSuccess(partial([6, 18, 16]),  1, 1);
     assertSuccess(partial([6, 19, 16]),  0, 0);
     assertFailure(partial([6, 20, 16]),  1);
     }

     @Test
     def
     scenario_extremeAttributes_biggerDifficulty
     {
     val
     partial = OutcomeCalculator.examine(withoutMinimumQuality, List(25, 15, 23), 9, 14)
     _
     assertSuccess(partial([6, 4, 3]),  0, 6);
     assertSuccess(partial([6, 4, 16]),  0, 2);
     assertSuccess(partial([20, 4, 17]),  0, 0);
     assertSuccess(partial([6, 4, 18]),  0, 0);
     assertFailure(partial([6, 4, 19]),  1);
     assertFailure(partial([6, 14, 3]),  4);
     }
     */
}());
