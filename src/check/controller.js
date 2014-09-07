/*global angular, _, calculator, chart */
angular.module('pp2.check', ['pp2.chart', 'pp2.utils']).controller('CheckController', ['$scope', function ($scope) {
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

    $scope.log = [];
    $scope.addLog = function () {
        var check = _.cloneDeep($scope.check);
        $scope.log.push({
            check: check,
            result: calculator.calculatePartitionedMemoized(check)
        });
    };
    $scope.clearLog = function () {
        $scope.log.length = 0;
    };

    $scope.tabs = [
        {
            template: "pie.tpl.html",
            title: "Details"
        },
        {
            template: "bar.tpl.html",
            title: "Vergleich"
        },
        {
            template: "roll.tpl.html",
            title: "Zufallswurf"
        },
        {
            template: "log.tpl.html",
            title: "Protokoll"
        },
        {
            template: "advanced.tpl.html",
            title: "Optionen"
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