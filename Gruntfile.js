module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    targetDir: 'lib'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['src/**'], dest: 'dist/'},
                    {expand: true, src: ['lib/**'], dest: 'dist/'},
                    {expand: true, src: ['bower_components/bootstrap/dist/css/bootstrap.css.map'], dest: 'dist/lib/bootstrap/', flatten: true},
                    {expand: true, src: ['index.html'], dest: 'dist/'}
                ]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
                push: true
            },
            src: ['**/*']
        },
        uglify: {
            dist: {}
        },
        useminPrepare: {
            html: 'src/check/check.html',
            options: {
                root: 'dist/'
            }
        },
        usemin: {
            html: 'dist/src/check/check.html'
        },
        watch: {
            files: ['**/*'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-usemin');

 //   grunt.registerTask('dist', ['bower', 'copy', 'gh-pages']);
    grunt.registerTask('dist', ['copy', 'useminPrepare', 'concat:generated', 'uglify:generated', 'usemin']);
};
