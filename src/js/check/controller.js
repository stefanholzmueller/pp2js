'use strict';

define(['angular', 'chart'], function (angular) {

    return angular.module('pp2.check', ['pp2.chart']).controller('CheckController', ['$scope', function ($scope) {
        var check = $scope.check = {
            attributes: [12, 12, 12],
            value: 4,
            difficulty: 0,
            options: {
                minimumQuality: true
            }
        };

        $scope.$watch("check", function (newCheck) {
            var partitioned = Checks.calculatePartitionedMemoized(newCheck);
            $scope.pieData = [
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

            var difficulties = _.uniq([12, 8, 4, 0, -4, -8, -12, newCheck.difficulty]).sort(function (a, b) {
                return a - b;
            });
            var checks = _.map(difficulties, function (difficulty) {
                var check = _.merge(_.cloneDeep(newCheck), { difficulty: difficulty });
                check.result = Checks.calculatePartitionedMemoized(check);
                return check;
            });
            var dataPointsSuccess = _.map(checks, function (check) {
                var failureCount = check.result[1].count;
                return { y: 8000 - failureCount, label: difficultyToString(check.difficulty), color: (newCheck.difficulty === check.difficulty ? '#008000' : '#609060') };
            });
            var dataPointsFailure = _.map(checks, function (check) {
                return { y: check.result[1].count, label: difficultyToString(check.difficulty), color: (newCheck.difficulty === check.difficulty ? '#bb0000' : '#cc5050') };
            });

            $scope.barData = [
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
        }, true);

        function toCanvasjsPieDataPoints(partitioned) {
            var partitions = partitioned[0].partitions;
            var dataPoints = _.map(partitions, function (p) {
                return {
                    x: p.quality,
                    y: p.count,
                    color: "#008000",
                    toolTipContent: "gelungen mit {x}"
                };
            });
            dataPoints.push({ y: partitioned[1].count, color: "#bb0000", toolTipContent: "misslungen" });
            return dataPoints;
        }
    }]);
});