/*global angular, calculator, chart */
angular.module('pp2.check', ['pp2.chart']).controller('CheckController', ['$scope', function ($scope) {
    'use strict';

    $scope.check = {
        attributes: [12, 12, 12],
        value: 4,
        difficulty: 0,
        options: {
            minimumQuality: true,
            festeMatrix: false,
            wildeMagie: false,
            spruchhemmung: false
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
        var partitioned = calculator.calculatePartitionedMemoized($scope.check);
        return chart.toPieData(partitioned);
    };

    $scope.getBarData = function () {
        return chart.getBarData($scope.check);
    };
}]);