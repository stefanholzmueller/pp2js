/*global angular, _, calculator, chart */
angular.module('pp2.check', ['pp2.chart', 'pp2.utils']).controller('CheckController', ['$scope', function ($scope) {
    'use strict';

    $scope._ = _;

    $scope.check = {
        attributes: [12, 12, 12],
        skill: 4,
        difficulty: 0,
        options: {
            edition: 4,
            minimumQuality: true,
            festeMatrix: false,
            wildeMagie: false,
            spruchhemmung: false
        }
    };
    $scope.$watch("check", function () {
        $scope.result = calculator.calculatePartitionedMemoized($scope.check);
        $scope.difficultyRange = _.map(_.range(30, -31, -1), function (x) {
            return { label: "" + x, value: x };
        });
    }, true);

    $scope.showDifficulty = function (difficulty) {
        var modifier = $scope.check.options.edition == 5 ? -difficulty : difficulty;
        return (modifier >= 0 ? "+" : "") + modifier;
    };

    $scope.getPieData = function () {
        return chart.getPieData($scope.check);
    };
    $scope.getPieData4 = function () {
        var check = _.cloneDeep($scope.check);
        check.options.edition = 4;
        return chart.getPieData(check);
    };
    $scope.getPieData5 = function () {
        var check = _.cloneDeep($scope.check);
        check.options.edition = 5;
        return chart.getPieData(check);
    };

    $scope.getBarData = function () {
        return chart.getBarData($scope.check);
    };

    $scope.log = [];
    $scope.clearLog = function () {
        $scope.log.length = 0;
    };
    $scope.addLog = function () {
        $scope.log.push({
            check: _.cloneDeep($scope.check),
            result: _.cloneDeep($scope.result)
        });
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
            template: "log.tpl.html",
            title: "Protokoll"
        },
        {
            template: "editions.tpl.html",
            title: "DSA 4 vs. DSA 5"
        }
    ];
    $scope.currentTab = $scope.tabs[0];
    $scope.switchTab = function (tab) {
        $scope.currentTab = tab;
    };

}]);
