/*global _ */
var evaluator = (function () {
    'use strict';

    function successOrFailure(options, attributes, skill, difficulty, dice) {
        var effectiveValuesFn = options.edition == 5 ? effectiveValuesForEdition5 : effectiveValuesForEdition4;
        var effectiveValues = effectiveValuesFn(attributes, skill, difficulty);
        return successOrFailureInternal(options.minimumQuality, effectiveValues.effectiveAttributes, effectiveValues.effectiveSkill, skill, dice);
    }

    function effectiveValuesForEdition5(attributes, skill, difficulty) {
        return {
            effectiveAttributes: _.map(attributes, function (a) {
                return a - difficulty;
            }),
            effectiveSkill: skill
        };
    }

    function effectiveValuesForEdition4(attributes, skill, difficulty) {
        var ease = skill - difficulty;
        return {
            effectiveAttributes: ease < 0 ? _.map(attributes, function (a) {
                return a + ease;
            }) : attributes,
            effectiveSkill: Math.max(ease, 0)
        };
    }

    function successOrFailureInternal(minimumQuality, effectiveAttributes, effectiveSkill, skill, dice) {
        var comparisions = _.map(_.zip(dice, effectiveAttributes), function (pair) {
            return pair[0] - pair[1];
        });
        var exceededings = _.filter(comparisions, function (x) {
            return x > 0;
        });
        var usedPoints = sum(exceededings);

        if (usedPoints > effectiveSkill) {
            return new Failure(usedPoints - effectiveSkill);
        } else {
            var leftoverPoints = effectiveSkill - usedPoints;
            var cappedQuality = Math.min(leftoverPoints, skill);
            var quality = applyMinimumQuality(minimumQuality, cappedQuality);
            var negativeGap = _.isEmpty(exceededings) ? _.max(comparisions) : 0;
            return new Success(quality, leftoverPoints - negativeGap);
        }
    }

    function sum(array) {
        return _.reduce(array, function (acc, num) {
            return acc + num;
        }, 0);
    }

    function specialOutcome(options, skill, dice) {
        if (all3EqualTo(dice, 1)) {
            return new SpectacularSuccess(applyMinimumQuality(options.minimumQuality, skill));
        } else if (twoEqualTo(dice, 1)) {
            return new AutomaticSuccess(applyMinimumQuality(options.minimumQuality, skill));
        } else if (all3EqualTo(dice, 20)) {
            return new SpectacularFailure();
        } else if (options.wildeMagie && twoGreaterThan(dice, 18)) {
            return new AutomaticFailure();
        } else if (options.festeMatrix && sumGreaterThan(dice, 57) && twoEqualTo(dice, 20)) {
            return new AutomaticFailure();
        } else if (!options.festeMatrix && twoEqualTo(dice, 20)) {
            return new AutomaticFailure();
        } else if (options.spruchhemmung && twoSame(dice)) {
            return new SpruchhemmungFailure();
        }
    }

    function all3EqualTo(dice, n) {
        return dice[0] === n && dice[1] === n && dice[2] === n;
    }

    function twoEqualTo(dice, n) {
        return twoFiltered(dice, function (d) {
            return d === n;
        });
    }

    function twoSame(dice) {
        return dice[0] === dice[1] || dice[1] === dice[2] || dice[0] === dice[2];
    }

    function twoGreaterThan(dice, n) {
        return twoFiltered(dice, function (d) {
            return d > n;
        });
    }

    function sumGreaterThan(dice, n) {
        return (dice[0] + dice[1] + dice[2] > n);
    }

    function twoFiltered(dice, fn) {
        return _.filter(dice, fn).length >= 2;
    }

    function applyMinimumQuality(minimumQuality, rawValue) {
        return Math.max(rawValue, minimumQuality ? 1 : 0);
    }

    function SpectacularSuccess(quality) {
        this.success = true;
        this.quality = quality;
    }

    function AutomaticSuccess(quality) {
        this.success = true;
        this.quality = quality;
    }

    function AutomaticFailure() {
        this.success = false;
    }

    function SpectacularFailure() {
        this.success = false;
    }

    function SpruchhemmungFailure() {
        this.success = false;
    }

    function Success(quality, gap) {
        this.success = true;
        this.quality = quality;
        this.gap = gap;
    }

    function Failure(gap) {
        this.success = false;
        this.gap = gap;
    }


    return {
        Failure: Failure,
        Success: Success,
        AutomaticFailure: AutomaticFailure,
        AutomaticSuccess: AutomaticSuccess,
        SpectacularFailure: SpectacularFailure,
        SpectacularSuccess: SpectacularSuccess,
        SpruchhemmungFailure: SpruchhemmungFailure,
        evaluate: function (options, attributes, skill, difficulty, dice) {
            var special = specialOutcome(options, skill, dice);
            if (special) {
                return special;
            }
            return successOrFailure(options, attributes, skill, difficulty, dice);
        }
    };

})
();
