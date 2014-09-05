(function (angular) {
    'use strict';

    return angular.module('pp2.chart', []).directive('canvasjsChart', function () {
        return {
            restrict: 'E',
            scope: {
                id: "@",
                data: "="
            },
            link: function (scope, element, attrs) {
                var chart = new CanvasJS.Chart(scope.id, {});

                scope.$watch("data", function (newData) {
                    chart.options.data = newData;
                    chart.render();
                });
            },
            template: '<div id="{{id}}" style="height: 100%; width: 100%;" class="center-block">'
        };
    });
})(angular);