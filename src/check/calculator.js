var calculator = (function (_, evaluator) {
    'use strict';

    var MAX_PIPS = 20;
    var COMBINATIONS = buildCombinations();

    function buildCombinations() {
        var combinations = [];
        for (var die1 = 1; die1 <= MAX_PIPS; die1++) {
            for (var die2 = 1; die2 <= MAX_PIPS; die2++) {
                for (var die3 = 1; die3 <= MAX_PIPS; die3++) {
                    combinations.push([die1, die2, die3]);
                }
            }
        }
        Object.freeze(combinations);
        return combinations;
    }

    function calculatePartitioned(check) {
        function validateCheck(check) {
            if (!_.all(check.attributes, _.isNumber)) {
                throw "attributes contain invalid numbers";
            }
            if (!_.isNumber(check.value)) {
                throw "value is invalid";
            }
            if (!_.isNumber(check.difficulty)) {
                throw "difficulty is invalid";
            }
            if (!_.isBoolean(check.options.minimumQuality)) {
                throw "minimumQuality is invalid";
            }
        }

        validateCheck(check);
        var evaluate = _.partial(evaluator.evaluate, check.options, check.attributes, check.value, check.difficulty);
        var outcomes = _.map(COMBINATIONS, function (dice) {
            return evaluate(dice);
        });
        var successes = _.filter(outcomes, "success");
        var counts = _.countBy(successes, "quality");
        var pairs = _.pairs(counts);
        var sorted = _.sortBy(pairs, function (a, b) {
            return a[0] - b[0];
        }).reverse();
        var partitions = _.map(sorted, function (x) {
            return { quality: x[0], count: x[1] };
        });

        return [
            { label: "gelungen!", count: successes.length, partitions: partitions },
            { label: "misslungen", count: 8000 - successes.length }
        ];
    }


    return {
        calculate: function (options, attributes, value, difficulty) {
            var evaluate = _.partial(evaluator.evaluate, options, attributes, value, difficulty);
            var outcomes = _.map(COMBINATIONS, function (dice) {
                return evaluate(dice);
            });

            var successes = _.filter(outcomes, function (o) {
                return o.success;
            });
            var totalQuality = _.reduce(successes, function (sum, success) {
                return sum + success.quality;
            }, 0);

            var probability = successes.length / outcomes.length;
            var average = totalQuality / successes.length;

            return { probability: probability, average: average };
        },

        calculatePartitionedMemoized: _.memoize(calculatePartitioned, function (check) {
            return _.sortBy(check.attributes) + "|" + check.value + "|" + check.difficulty + "|" + check.options.minimumQuality;
        })

    };
})(_, evaluator);