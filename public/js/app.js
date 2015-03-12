'use strict';
     
// Declare app level module which depends on filters, and services
angular.module('myQmpj', [
    'myQmpj.filters', 
    'myQmpj.services', 
    'myQmpj.directives',
    'angularFileUpload', 
    'ui.bootstrap', 
    'schemaForm' , 
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'http-auth-interceptor',
    'googlechart'
  ]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/index',
            controller: IndexCtrl
        }).
        when('/config', {
            templateUrl: 'partials/config',
            controller: ConfigCtrl
        }).
        when('/home', {
            templateUrl: 'partials/home',
            controller: HomeCtrl
        }).
        when('/register', {
            templateUrl: 'partials/register',
            controller: RegisterCtrl
        }).
        when('/results/:id', {
            templateUrl: 'partials/results',
            controller: ResultsCtrl
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
  }]).run(function ($rootScope, $location, authenticationService) {

    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/logout', '/register'].indexOf($location.path()) == -1 )) {
        authenticationService.currentUser();
      }
    });

    // On catching 401 errors, redirect to the login page.
    $rootScope.$on('event:auth-loginRequired', function() {
      $location.path('/');
      return false;
    });
  });