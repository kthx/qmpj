'use strict';

/* Controllers */

function IndexCtrl($scope) {  
    $scope.title = "QMPJ";
    $scope.alerts = [];
};

function HomeCtrl($scope, authenticationService) {  
    $scope.title = "QMPJ";
    $scope.alerts = [];
};

function ConfigCtrl($scope) {
    $scope.alerts = [];
};

function RegisterCtrl($scope, authenticationService, $location) {
    $scope.alerts = [];

    $scope.schema = {
        type: "object",
        properties: {
            "username": {
                "title": "Username",
                "type": "string",
                minLength: 4
            },
            "email": {
                "title": "Email",
                "type": "string",
                "pattern": "^\\S+@\\S+$",
            },
            "password": {
                "title": "Password",
                "type": "string",
                "x-schema-form": {
                    "type": "password"
                }
            },
        },
        "required": [
            "email",
            "password"
        ]
    };

    $scope.form = [
        {
            key: "username",
            type: "text"
        },
        {
            key: "email",
            type: "email"
        },
        {
            key: "password",
            type: "password"
        },
        {
          type: "submit",
          title: "Register"
        }
    ];
    $scope.model = {};
        

    $scope.onSubmit = function(form) {
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            authenticationService.createUser({
                email: $scope.model.email,
                username: $scope.model.username,
                password: $scope.model.password
            },function(err) {
                $scope.$parent.alerts.errors = {};
                if (!err) {
                    $location.path('/home');
                    $scope.$parent.alerts.push({msg: 'Account registered successfully', type: 'success'});
                } else {
                    console.log(err.errors);
                    $scope.$parent.alerts.push({msg: 'Account not registered successfully', type: 'error'});
                }
            });
        }
    }; 
};

function ProjectCtrl($scope, authenticationService, $location, projectsService, $filter, $rootScope) {
    
    $scope.resizeGraph = function() {
        $rootScope.$emit('resizeMsg');
    };

    $scope.alerts = [];

    $scope.schema = {
        type: "object",
        properties: {
            "title": {
                "title": "Project name",
                "type": "string",
                minLength: 3
            },
        }
    };

    $scope.form = [
        {
            key: "title",
            type: "text"
        },
        {
          type: "submit",
          title: "Save"
        }
    ];
    $scope.model = {};
        
    $scope.reloadProjects = function() {
        projectsService.query(function(projects) {

            $scope.projects = projects;
            console.log($scope);
            //$scope.projectChart = $filter('convertToGraph')($scope.projects,"projectChart");

      });
    };

    $scope.remove = function(project) {
        console.log("yes");
      project.$remove();

      for (var i in $scope.projects) {
        if ($scope.projects[i] == project) {
          $scope.projects.splice(i, 1);
        }
      }
    };
    $scope.onSubmit = function(form) {
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            var project = new projectsService({
                title: $scope.model.title
            });

            project.$save(function(response) {
                $scope.$parent.alerts.errors = {};
                if (response) {              
                    $scope.reloadProjects();

                    $scope.$parent.alerts.push({msg: 'Project saved successfully', type: 'success'});
                } else {
                    console.log(err.errors);
                    $scope.$parent.alerts.push({msg: 'Project not saved successfully', type: 'error'});
                }
            });
        }
    };
    $scope.reloadProjects();
};

function ProjectGraphCtrl($scope, $filter) {
    $scope.projectChart = $filter('convertToGraph')($scope.project,"projectChart");
};

function LoginCtrl($scope, authenticationService, $location) {
    $scope.alerts = [];
    $scope.user = {};


    $scope.redirectToRegisterForm = function () {
      $location.path("/register/")
    };


    $scope.alerts = [];

    $scope.schema = {
        type: "object",
        properties: {
            "email": {
                "title": "Email",
                "type": "string",
                "pattern": "^\\S+@\\S+$",
            },
            "password": {
                "title": "Password",
                "type": "string",
                "x-schema-form": {
                    "type": "password"
                }
            },
        },
        "required": [
            "email",
            "password"
        ]
    };

    $scope.form = [
        {
            key: "email",
            type: "email"
        },
        {
            key: "password",
            type: "password"
        },
        {
          type: "submit",
          title: "Login"
        }
    ];
    $scope.model = {};
        

    $scope.onSubmit = function(form) {

        console.log("login starting");
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            authenticationService.login('password', {
              'email': $scope.model.email,
              'password': $scope.model.password
            },function(err) {
                $scope.errors = {};

                if (!err) {
                    $location.path('/home');
                } else {
                    console.log(err);
                    $scope.error.other = err.message;
                }
            });
        }
    };
};

function ConfigFormCtrl($scope, configService, $anchorScroll) {
    $scope.schema = {
        type: "object",
        properties: {}
    };

    var loadModel = function(forceReload) {
        $scope.form = [];
        $scope.model = {};
        var scopeForm = [];
        configService.getCurrentConfig(forceReload).then(function () {
            var currentConfig = configService.currentConfig;
            var scopeModel = {};
            var schemaFields = {};

            var handleModule = function(obj) {

                angular.forEach(obj, function(value, key) { 

                    var titleNode = $.grep(value.metadata, function(item){ 
                        return item.$.name == "com.jmv.title"; 
                    });
                    var title = titleNode[0].$.value;
                    var helpNode = $.grep(value.metadata, function(item){ 
                        return item.$.name == "com.jmv.helptext"; 
                    });
                    var helptext = helpNode[0].$.value;
                    var idNode = $.grep(value.metadata, function(item){ 
                        return item.$.name == "com.jmv.identifier"; 
                    });
                    var id = idNode[0].$.value;

                    var fieldset = {
                        type: "fieldset",
                        id: title.replace(" check", ""),
                        title: title,
                        items: [
                            {
                                type: "help",
                                helpvalue: "<p>" + helptext + "</p>"
                            }
                        ]
                    };

                    angular.forEach(value.property, function(pNode, key) { 

                        var propVal = pNode.$.value;

                        if(isNaN(propVal)) {
                            if(propVal == 'true') {
                                propVal = true;
                            }
                            if(propVal == 'false') {
                                propVal = false;
                            }
                        }else{
                            propVal = parseInt(propVal);
                        }

                            

                        scopeModel[id + pNode.$.name] = propVal;

                        if(
                            pNode.$.name == "format"
                            ||pNode.$.name == "message"
                            ||pNode.$.name == "groups"
                            ||pNode.$.name == "option"
                            ||pNode.$.name == "scope"
                            ||pNode.$.name == "ignorePattern"
                        ) {
                            schemaFields[id + pNode.$.name] = {
                                type: "string",
                                fieldType: "string", 
                            };
                        }

                        if(
                            pNode.$.name == "allowMissingJavadoc"
                            ||pNode.$.name == "allowMissingParamTags"
                            ||pNode.$.name == "allowMissingReturnTag"
                            ||pNode.$.name == "allowMissingThrowsTags"
                            ||pNode.$.name == "allowThrowsTagsForSubclasses"
                            ||pNode.$.name == "allowUndeclaredRTE"
                            ||pNode.$.name == "applyToPublic"
                            ||pNode.$.name == "applyToProtected"
                            ||pNode.$.name == "applyToPackage"
                            ||pNode.$.name == "applyToPrivate"
                        ) {
                            schemaFields[id + pNode.$.name] = {
                                type: "boolean",
                                fieldType: "checkbox", 
                            };
                        }

                        if(
                            pNode.$.name == "minimum" 
                            || pNode.$.name == "maximum" 
                            || pNode.$.name == "methodMaximum" 
                            || pNode.$.name == "classMaximum" 
                            || pNode.$.name == "fileMaximum" 
                            || pNode.$.name == "max") {
                            schemaFields[id + pNode.$.name] = {
                                type: "number", 
                                fieldType: "number",
                            };
                        }


                        if(pNode.$.name == "excludedClasses") {
                            schemaFields[id + pNode.$.name] = {
                                type: "string", 
                                fieldType: "textarea",
                                description: "User-configured class names to ignore"
                            };
                        }

                        if(pNode.$.name == "severity") {
                            schemaFields[id + pNode.$.name] = {
                                type: "string",
                                fieldType: "select",
                                enum: [
                                    "error",
                                    "warning",
                                    "info",
                                    "ignore",
                                ],
                                description: "Set to ignore to disable this check"  
                            };
                        }

                        if(pNode.$.name == "lineSeparator") {
                            schemaFields[id + pNode.$.name] = {
                                type: "string",
                                fieldType: "select",
                                enum: [
                                    "system",
                                    "crlf",
                                    "cr",
                                    "lf",
                                ],
                                description: "type of line separator"  
                            };
                        }

                        if(pNode.$.name == "tokens") {
                            schemaFields[id + pNode.$.name] = {
                                type: "string",
                                fieldType: "string",
                                description: "subset of tokens LAND, BAND, LOR, BOR, BXOR"  
                            };
                        }

                        if(pNode.$.name == "fileExtensions") {
                            schemaFields[id + pNode.$.name] = {
                                type: "string",
                                fieldType: "string",
                                description: "file type extension of the files to check as a sep comma list"  
                            };
                        }
                            
                        var prop = {
                            key: id + pNode.$.name,
                            type: schemaFields[id + pNode.$.name].fieldType,
                            title: pNode.$.name.charAt(0).toUpperCase() + pNode.$.name.slice(1),
                            onChange: function(modelValue,form) {
                                pNode.$.value = modelValue;
                            }
                        };
                        this.push(prop);

                    }, fieldset.items);
                
                    this.push(fieldset);
                }, scopeForm);
            };

            var nonTreeWalkerModules = $.grep(currentConfig.module.module, function(item){ 
                return item.$.name != "TreeWalker"; 
            });

            var treeWalkerModules = $.grep(currentConfig.module.module, function(item){ 
                return item.$.name == "TreeWalker"; 
            });

            handleModule(treeWalkerModules[0].module);
            handleModule(nonTreeWalkerModules);

            scopeForm.push({
                type: "submit",
                title: "Save"
            });
            scopeForm.push({   
                type: 'button', 
                style: 'btn-warning', 
                title: 'Restore defaults', onClick: function(){
                    configService.restoreRefaults().then(function (result) {
                        $scope.$parent.alerts = [];
                        if(result) {
                            loadModel(true);
                            $scope.$parent.alerts.push({msg: 'Configuration restored', type: 'success'});
                        }else{
                            $scope.$parent.alerts.push({msg: 'Error restoring configuration defaults', type: 'danger'});
                        }
                        $anchorScroll();
                    });
                } 
            });

            $scope.form = scopeForm;
            $scope.schema.properties = schemaFields;
            $scope.model = scopeModel;     
        });
    };

    loadModel(false);

    $scope.onSubmit = function(form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            configService.saveCurrentConfig().then(function (result) {

                $scope.$parent.alerts = [];
                if(result) {
                    $scope.$parent.alerts.push({msg: 'Configuration saved successfully', type: 'success'});
                }else{
                    $scope.$parent.alerts.push({msg: 'Error saving configuration', type: 'danger'});
                }
                $anchorScroll();
            });
        }
    }
};

function HeaderCtrl($scope, $location, lastResultService, authenticationService) {
    $scope.disableIfNoLatestResult = function () {
      return (lastResultService.getLastResult().length === 0)?'disabled':'';
    };
    $scope.resultPath = function () {
      return lastResultService.getLastResult();
    };
    $scope.isActive = function (viewLocation) { 
      return (viewLocation.length > 1 && $location.path().indexOf(viewLocation) == 0) || $location.path() === viewLocation;
    };

    $scope.logout = function() {
      authenticationService.logout(function(err) {
        if(!err) {
          $location.path('/');
        }
      });
    };
};

function UploadCtrl($scope, $upload, $location, lastResultService) {
    $scope.noUploadInProgress = true;
    $scope.$parent.alerts = [];
    $scope.onFileSelect = function($files, project) {
        $scope.noUploadInProgress = false;
        var selectedProject = project;
        $scope.$parent.alerts.push({msg: 'Analysis in progress, please wait'});
        if($files.length == 0) {
            $scope.$parent.alerts = []; 
            $scope.$parent.alerts.push({msg: 'Error in file upload', type: 'danger' });
            return false;
        }
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/projects/upload', 
                method: 'POST',
                data: {myObj: $scope.myModelObj},
                file: file,
            }).success(function(data, status, headers, config) {
                console.log("this is the project: ", selectedProject);
                if(data.success) {
                    if(selectedProject.revisions === undefined) {
                        selectedProject.revisions = [];
                    }
                    var revision = {
                        revisionNumber: selectedProject.revisions.length + 1,
                        location: data.path,
                        checkstyleError: data.checkstyleError,
                        checkstyleInfo: data.checkstyleInfo,
                        checkstyleWarning: data.checkstyleWarning,
                        failedUnitTestsCount: data.failedUnitTestsCount,
                        erroredUnitTestsCount: data.erroredUnitTestsCount,
                        skippedUnitTestsCount: data.skippedUnitTestsCount,
                        unitTestsTime: data.unitTestsTime,
                        filesCount: data.filesCount,
                        unitTestsCount: data.unitTestsCount,
                    }

                    selectedProject.revisions.push(revision);
                    selectedProject.$update(function(){
                    lastResultService.setLastResult(data.path);

                    console.log(data);
                    $scope.noUploadInProgress = true;
                    $location.path("/results/" + data.path);
                    });
                    
                }else{
                    $scope.noUploadInProgress = true;
                    $scope.$parent.alerts = [];
                    $scope.$parent.alerts.push({msg: 'Error in analysis, please check config and source code.', type: 'danger' });
                }
            });
        }
    };
};

function ResultsCtrl($scope, $http, $routeParams, lastResultService, $filter) {
    $http.get('/results/api/' + $routeParams.id).
        success(function(data) {
            lastResultService.setLastResult($routeParams.id);
            $scope.currentUrl = data.currentUrl;
            $scope.sourceCode = data.sourceCode;
            $scope.junitResults = data.junit;
            $scope.cResults = data.checkstyleResults;
            
            $scope.hBars = $filter('convertToGraph')(data.checkstyleResults.checkstyle.file,"hBars");
            $scope.vBars = $filter('convertToGraph')(data.checkstyleResults.checkstyle.file,"vBars");
            $scope.pie = $filter('convertToGraph')(data.checkstyleResults.checkstyle.file,"pie");
    });
};

