module.exports = function(config){
    config.set({
    basePath : '../',
    reporters: ['story'],
    colors: true,
    autoWatch : false,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    files : [
        'public/bower_components/jquery/dist/jquery.min.js',
        'public/bower_components/angular/angular.js',
        'public/bower_components/angular-mocks/angular-mocks.js',
        
        'public/js/lib/angular/angular-file-upload.js',
        'public/js/lib/angular/angular-resource.js',
        'public/js/prettify.js',
        'public/js/app.js',
        'public/js/services.js',
        'public/js/filters.js',
        'public/js/directives.js',
        'public/js/controllers.js',
        'test/frontend/*-test.js'
    ],



    plugins : [
        'karma-jasmine',
        'karma-chrome-launcher', 
        'karma-story-reporter'      
    ]
})}
