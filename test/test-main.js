var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src',

    paths: {
        angular: '../lib/angular/angular',
        canvasjs: '//cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min',
        lodash: '../lib/lodash/lodash.compat'
    },

    shim: {
        'angular': {'exports': 'angular'},
        'lodash': {'exports': '_'}
    },
    priority: [
        "angular"
    ],

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});