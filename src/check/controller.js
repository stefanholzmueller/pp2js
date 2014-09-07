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
    $scope.$watch("check", function () {
        $scope.result = calculator.calculatePartitionedMemoized($scope.check);
    }, true);

    $scope.getPieData = function () {
        return chart.toPieData($scope.result);
    };

    $scope.getBarData = function () {
        return chart.getBarData($scope.check);
    };

    $scope.log = [];
    $scope.addLog = function () {
        $scope.log.push({
            check: _.cloneDeep($scope.check),
            result: _.cloneDeep($scope.result)
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

}]);