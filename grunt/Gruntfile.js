module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: '../public/css/style.css',
                tasks: ['cssmin']
            },
            frontendjs: {
                files: ['../public/js/*.js','!../public/js/jmv.min.js'],
                tasks: ['uglify']
            },
            karma: {
                files: ['../public/js/*.js', '../test/frontend/*.js'],
                tasks: ['karma:unit:run']
            },            
            backendjs: {
                files: ['../controllers/*.js','../app.js', '../test/backend/*.js'],
                tasks: ['simplemocha']
            }
        },
        karma: {
            unit: {
                configFile: '../config/karma.conf.js',
                background: true
            }
        },
        simplemocha: {
            options: {
              globals: ['should'],
              timeout: 50000,
              ignoreLeaks: false,
              ui: 'bdd',
              reporter: 'spec'
            },

            all: { src: ['../test/backend/*.js'] }
        },
        uglify: {
            options: {
                preserveComments: false,
                mangle: false,
                compress: {
                    drop_debugger: true,
                    drop_console: true,
                }
            },
            my_target: {
              files: {
                    '../public/js/jmv.min.js': [
                        '../public/bower_components/jquery/dist/jquery.min.js',
                        '../public/js/bootstrap.min.js',
                        '../public/js/lib/angular/angular.js',
                        '../public/js/lib/angular-route/angular-route.min.js',
                        '../public/js/lib/angular/angular-file-upload.js',
                        '../public/js/lib/angular/angular-ui.bootstrap.js',
                        '../public/js/lib/angular-sanitize/angular-sanitize.min.js',
                        '../public/js/lib/tv4/tv4.js',
                        '../public/js/lib/objectpath/lib/ObjectPath.js',
                        '../public/js/lib/angular-schema-form/dist/schema-form.min.js',
                        '../public/js/lib/angular-schema-form/dist/bootstrap-decorator.min.js',
                        '../public/js/lib/google-chart/ng-google-chart.js',
                        '../public/js/app.js',
                        '../public/js/services.js',
                        '../public/js/controllers.js',
                        '../public/js/filters.js',
                        '../public/js/directives.js',
                        '../public/js/prettify.js',
                    ],
                }
            }
        },
        cssmin: {
            minify: {
                options: {
                    keepSpecialComments: 0,
                },
                files: {
                    '../public/css/jmv.min.css': [
                        '../public/prettify.css',
                        '../public/css/bootstrap.css',
                        '../public/css/style.css'

                    ]
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.registerTask('default', ['karma:unit','watch']);
}