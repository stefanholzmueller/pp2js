({
    appDir: "",
    baseUrl: "src",
    dir: "build",
    modules: [
        {
            name: "main"
        }
    ],
    paths: {
        angular: '../lib/angular/angular',
        canvasjs: 'empty:',
        lodash: '../lib/lodash/lodash.compat'
    }, shim: {
        'angular': {'exports': 'angular'},
        'lodash': {'exports': '_'}
    }
})