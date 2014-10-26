/*global _, calculator */
var chart = (function () {
    'use strict';

    var percentageToolTipContent = ": #percent%",
        percentFormatString = "#0.####",
        colorSuccess = "#108A10",
        colorSuccessLight = "#669666",
        colorFailure = "#BB1010",
        colorFailureLight = "#C55555";

    function difficultyToString(difficulty) {
        if (difficulty > 0) {
            return "erschwert um " + difficulty;
        }
        if (difficulty < 0) {
            return "erleichtert um " + (-difficulty);
        }
        return "nicht modifiziert";
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    function getPieData(check) {
        var partitioned = calculator.calculatePartitionedMemoized(check);
        var dataPoints = _.map(partitioned.success.partitions, function (p) {
            return {
                x: p.quality,
                y: p.count,
                color: colorSuccess,
                toolTipContent: "Gelungen mit Qualität {x}" + percentageToolTipContent
            };
        });
        dataPoints.push({ y: partitioned.failure.count, color: colorFailure, toolTipContent: "Misslungen" + percentageToolTipContent });

        return [
            {
                type: "pie",
                percentFormatString: percentFormatString,
                startAngle: -90,
                axisX: {
                    margin: 0
                },
                axisY: {
                    margin: 0
                },
                dataPoints: dataPoints
            }
        ];
    }

    function getBarData(originalCheck) {
        var range = _.range(12, -13, -4),
            difficulties = _.uniq(range.concat([originalCheck.difficulty])).sort(compareNumbers),
            checks = _.map(difficulties, function (difficulty) {
                var check = _.merge(_.cloneDeep(originalCheck), { difficulty: difficulty });
                check.result = calculator.calculatePartitionedMemoized(check);
                return check;
            });

        function toDataPoints(checks, success) {
            return _.map(checks, function (check) {
                var count = success ? check.result.success.count : check.result.failure.count,
                    text = success ? "Gelungen" : "Misslungen",
                    color = success ? colorSuccess : colorFailure,
                    lightColor = success ? colorSuccessLight : colorFailureLight;
                return {
                    y: count,
                    label: difficultyToString(check.difficulty),
                    color: (originalCheck.difficulty === check.difficulty ? color : lightColor),
                    toolTipContent: text + percentageToolTipContent
                };
            });
        }

        return [
            {
                type: "stackedBar100",
                percentFormatString: percentFormatString,
                dataPoints: toDataPoints(checks, true)
            },
            {
                type: "stackedBar100",
                percentFormatString: percentFormatString,
                dataPoints: toDataPoints(checks, false)
            }
        ];
    }

    return {
        getPieData: getPieData,
        getBarData: getBarData
    };

}());
