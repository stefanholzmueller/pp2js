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
        copy: {
            main: {
                files: [
                    {expand: true, src: ['src/**'], dest: 'dist/'},
                    {expand: true, src: ['lib/canvasjs*'], dest: 'dist/'}
                ]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
		push: false
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

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-tsd');

    grunt.registerTask('dist', ['bower:dist', 'copy', 'gh-pages']);
}
