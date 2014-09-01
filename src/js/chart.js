"use strict";


var module = angular.module('pp2.chart', []);

module.directive('canvasjsChart', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var id = scope.id = attrs.id;
            var chart = new CanvasJS.Chart(id, {});

            scope.$watch(attrs.data, function(newData) {
                chart.options.data = newData;
                chart.render();
            });
        },
        template: '<div id="barChart" style="height: 100%; width: 100%;" class="center-block">'
    };
});