/*global _, calculator */
var chart = (function () {
    'use strict';

    var percentageToolTipContent = ": #percent%",
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

    function toPieData(partitioned) {
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
        var difficulties = _.uniq([12, 8, 4, 0, -4, -8, -12, originalCheck.difficulty]).sort(compareNumbers),
            checks = _.map(difficulties, function (difficulty) {
                var check = _.merge(_.cloneDeep(originalCheck), { difficulty: difficulty });
                check.result = calculator.calculatePartitionedMemoized(check);
                return check;
            });

        function toDataPoints(checks, success) {
            return _.map(checks, function (check) {
                var color = success ? colorSuccess : colorFailure,
                    lightColor = success ? colorSuccessLight : colorFailureLight;
                return {
                    y: success ? check.result.success.count : check.result.failure.count,
                    label: difficultyToString(check.difficulty),
                    color: (originalCheck.difficulty === check.difficulty ? color : lightColor),
                    toolTipContent: (success ? "Gelungen" : "Misslungen") + percentageToolTipContent
                };
            });
        }

        return [
            {
                type: "stackedBar100",
                dataPoints: toDataPoints(checks, true)
            },
            {
                type: "stackedBar100",
                dataPoints: toDataPoints(checks, false)
            }
        ];
    }

    return {
        toPieData: toPieData,
        getBarData: getBarData
    };

}());
