/*global _ */
var calculator = (function (evaluator) {
    'use strict';

    function buildCombinations(pips) {
        var die1, die2, die3,
            combinations = [];
        for (die1 = 1; die1 <= pips; die1++) {
            for (die2 = 1; die2 <= pips; die2++) {
                for (die3 = 1; die3 <= pips; die3++) {
                    combinations.push([die1, die2, die3]);
                }
            }
        }
        Object.freeze(combinations);
        return combinations;
    }

    var COMBINATIONS = buildCombinations(20);

    function sum(array) {
        return _.reduce(array, function (a, x) {
            return a + x;
        }, 0);
    }

    function calculatePartitioned(check) {
        function validateCheck(check) {
            if (!_.all(check.attributes, _.isNumber)) {
                throw "attributes contain invalid numbers: " + check.attributes;
            }
            if (!_.isNumber(check.value)) {
                throw "value is invalid: " + check.value;
            }
            if (!_.isNumber(check.difficulty)) {
                throw "difficulty is invalid: " + check.difficulty;
            }
            if (!_.isBoolean(check.options.minimumQuality)) {
                throw "minimumQuality is invalid: " + check.options.minimumQuality;
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
            partitions.push({ quality: parseInt(key), count: value, probability: value / (outcomes.length) });
        });
        var sorted = _.sortBy(partitions, "quality").reverse();
        var qualities = _.map(successes, "quality");
        var totalQuality = sum(qualities);

        return {
            success: {
                partitions: sorted,
                count: successes.length,
                probability: successes.length / outcomes.length,
                quality: totalQuality / successes.length
            },
            failure: {
                count: outcomes.length - successes.length,
                probability: (outcomes.length - successes.length) / outcomes.length
            },
            quality: totalQuality / outcomes.length
        };
    }


    return {
        _buildDiceCombinations: buildCombinations,
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
        calculatePartitioned: calculatePartitioned,
        calculatePartitionedMemoized: _.memoize(calculatePartitioned, function (check) {
            return this._makeCacheKey(check);
        })

    };
}(evaluator));