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
                    {expand: true, src: ['lib/**'], dest: 'dist/'}
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

    grunt.registerTask('dist', ['bower', 'copy', 'gh-pages']);
}
