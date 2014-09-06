angular.module('pp2.check', ['pp2.chart']).controller('CheckController', ['$scope', function ($scope) {
    'use strict';

    var colorSuccess = "#108A10",
        colorSuccessLight = "#669666",
        colorFailure = "#BB1010",
        colorFailureLight = "#C55555";

    $scope.check = {
        attributes: [12, 12, 12],
        value: 4,
        difficulty: 0,
        options: {
            minimumQuality: true
        }
    };

    $scope.tabs = [
        {
            template: "pie.tpl.html",
            title: "Aufteilung"
        },
        {
            template: "bar.tpl.html",
            title: "Vergleich"
        }
    ];
    $scope.currentTab = $scope.tabs[0];
    $scope.switchTab = function (tab) {
        $scope.currentTab = tab;
    };

    $scope.getPieData = function () {
        function toCanvasjsPieDataPoints(partitioned) {
            var partitions = partitioned[0].partitions;
            var dataPoints = _.map(partitions, function (p) {
                return {
                    x: p.quality,
                    y: p.count,
                    color: colorSuccess,
                    toolTipContent: "gelungen mit {x}"
                };
            });
            dataPoints.push({ y: partitioned[1].count, color: colorFailure, toolTipContent: "misslungen" });
            return dataPoints;
        }

        var partitioned = calculator.calculatePartitionedMemoized($scope.check);
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
                dataPoints: toCanvasjsPieDataPoints(partitioned)
            }
        ];
    };

    $scope.getBarData = function () {
        function difficultyToString(difficulty) {
            if (difficulty > 0) {
                return "erschwert um " + difficulty;
            } else if (difficulty < 0) {
                return "erleichtert um " + (-difficulty);
            } else {
                return "nicht modifiziert";
            }
        }

        var difficulties = _.uniq([12, 8, 4, 0, -4, -8, -12, $scope.check.difficulty]).sort(function (a, b) {
            return a - b;
        });
        var checks = _.map(difficulties, function (difficulty) {
            var check = _.merge(_.cloneDeep($scope.check), { difficulty: difficulty });
            check.result = calculator.calculatePartitionedMemoized(check);
            return check;
        });
        var dataPointsSuccess = _.map(checks, function (check) {
            var failureCount = check.result[1].count;
            return { y: 8000 - failureCount, label: difficultyToString(check.difficulty), color: ($scope.check.difficulty === check.difficulty ? colorSuccess : colorSuccessLight) };
        });
        var dataPointsFailure = _.map(checks, function (check) {
            return { y: check.result[1].count, label: difficultyToString(check.difficulty), color: ($scope.check.difficulty === check.difficulty ? colorFailure : colorFailureLight) };
        });

        return [
            {
                type: "stackedBar100",
                color: "#008000",
                dataPoints: dataPointsSuccess
            },
            {
                type: "stackedBar100",
                color: "#bb0000",
                dataPoints: dataPointsFailure
            }
        ];
    };
}]);