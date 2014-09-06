/*global _ */
var calculator = (function (evaluator) {
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
        var partitions = [];
        _.forOwn(counts, function (value, key) {
            partitions.push({ quality: parseInt(key), count: value });
        });
        var sorted = _.sortBy(partitions, "quality").reverse();

        return {
            success: {
                count: successes.length, partitions: sorted
            },
            failure: {
                count: outcomes.length - successes.length
            }
        };
    }


    return {
        _makeCacheKey: function (check) {
            function toStringDeterministic(o) {
                var keys = _.keys(o).sort();
                var values = _.map(keys, function (key) {
                    var value = o[key];
                    if (_.isObject(value)) {
                        return toStringDeterministic(value);
                    } else {
                        return value.toString();
                    }
                });
                return '{' + values.join('|') + '}';
            }

            var cacheKey = _.cloneDeep(check);
            cacheKey.attributes.sort(); // increased chance of cache hits (ordering is irrelevant for the calculation)
            return toStringDeterministic(cacheKey);
        },
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
        calculatePartitioned: calculatePartitioned,
        calculatePartitionedMemoized: _.memoize(calculatePartitioned, function (check) {
            return this._makeCacheKey(check);
        })

    };
}(evaluator));