module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            dist: {
                options: {
                    targetDir: 'dist/lib'
                }
            },
            install: {
            }
        },
        buildGhPages: {
            options: {
                pull: false
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**/*']
        },
        tsd: {
            refresh: {
                options: {
                    command: 'reinstall',
                    latest: true,
                    config: 'tsd.json',
                    opts: {
                        // props from tsd.Options
                    }
                }
            }
        },
        watch: {
            files: ['**/*'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-build-gh-pages');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-tsd');

    grunt.registerTask('dist', ['bower:dist', 'gh-pages']);
}
