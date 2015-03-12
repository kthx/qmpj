'use strict';

/* Services */

var myQmpjServices = angular.module('myQmpj.services', []).
  value('version', '0.1');


myQmpjServices.service('authenticationService', function ($location, $rootScope, sessionService, userService, $cookieStore) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    this.login = function(provider, user, callback) {
        var cb = callback || angular.noop;
        sessionService.save({
          provider: provider,
          email: user.email,
          username: user.username,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err.data);
        });
      };

      this.logout = function(callback) {
        var cb = callback || angular.noop;
        sessionService.delete(function(res) {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      };

      this.createUser = function(userinfo, callback) {
        var cb = callback || angular.noop;
        userService.registerCurrentUser(userinfo,
          function(user) {
            $rootScope.currentUser = user;
            return cb();
          },
          function(err) {
            return cb(err);
          });
      };

      this.currentUser = function() {
        sessionService.get(function(user) {
          $rootScope.currentUser = user;
        });
      };

      this.changePassword = function(email, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;
        userService.update({
          email: email,
          username: user.username,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
            console.log('password changed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      };

  });
myQmpjServices.service('lastResultService', function() {
    var resultName = '';
    this.getLastResult = function() {
        return resultName;
    }
    this.setLastResult = function(name) {
        resultName = name;
    }
});
myQmpjServices.service('sessionService', function ($resource) {
    return $resource('/auth/session/');
  });

myQmpjServices.service('projectsService', function ($resource) {
    return $resource('/projects/api/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
});
myQmpjServices.service('userService', function ($resource, $http, $q) {

    this.registerCurrentUser = function(currentUser, successCallback, errorCallback){
        var cb = successCallback || angular.noop;
        var eb = errorCallback || angular.noop;
        
        $http({
            url: '/auth/users',
            method: "POST",
            data: JSON.stringify(currentUser),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            return cb();
        }).error(function (data, status, headers, config) {
            return eb(data);
        });
    };
});

myQmpjServices.service('configService', function($http, $q) {
    this.currentConfig = {};
    this.getCurrentConfig = function(forceReload) {
        var deferred = $q.defer();
        var self = this; 

        if(forceReload || Object.keys(self.currentConfig).length === 0) {
            $http.get('/config/api').
                success(function(data, status, headers, config) {
                    self.currentConfig = JSON.parse(data.data);
                    deferred.resolve(true);
                }).
                error(function (data, status, headers, config) {
                    deferred.resolve(false);
                });
        }else{
            deferred.resolve(true);
        }
        return deferred.promise;

    };

    this.restoreRefaults = function(){
        var deferred = $q.defer();
        var self = this;

        $http.get('/config/api/defaults').
            success(function(data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.resolve(false);
        });
        return deferred.promise;
    };

    this.saveCurrentConfig = function(){
        var deferred = $q.defer();
        var self = this; 
        
        $http({
            url: '/config/api',
            method: "POST",
            data: JSON.stringify(self.currentConfig),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            deferred.resolve(true);
        }).error(function (data, status, headers, config) {
            deferred.resolve(false);
        });
        return deferred.promise;
    };
    this.setCurrentConfig = function(config) { 
        var self = this; 
        self.currentConfig = config;
    };
});