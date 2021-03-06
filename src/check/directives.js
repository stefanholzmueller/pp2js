/*global angular, CanvasJS */
angular.module('pp2.chart', []).directive('canvasjsChart', function () {
    'use strict';

    CanvasJS.addCultureInfo("de", {
        decimalSeparator: ",",
        digitGroupSeparator: "."
    });

    return {
        restrict: 'E',
        scope: {
            id: "@",
            check: "=",
            getter: "="
        },
        link: function (scope) {
            var chart = new CanvasJS.Chart(scope.id, { culture: 'de' });

            scope.$watch("check", function () {
                chart.options.data = scope.getter();
                chart.render();
            }, true);
        },
        template: '<div id="{{id}}" style="height: 100%; width: 100%;" class="center-block">'
    };
});