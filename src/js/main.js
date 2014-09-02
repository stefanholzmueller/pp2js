'use strict';


require.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        canvasjs: '//cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min'
    },
    shim: {
        'angular' : {'exports' : 'angular'}
    },
    priority: [
        "angular"
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
    'angular',
    'app'
], function(angular, app) {
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    angular.element().ready(function() {
        angular.resumeBootstrap([app['name']]);
    });
});