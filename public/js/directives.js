'use strict';

/* Directives */

angular.module('myQmpj.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
    
    .directive('prettyprint', function($timeout) {
        return {
        restrict: 'C',
        scope: false,
        link: function postLink(scope, element, attrs) {
            $timeout(function () {
                element.html(prettyPrintOne(element.html(),'',true));
                var result = $.grep(scope.$parent.cResults.checkstyle.file, function(item){ 
                    return item.$.name.indexOf(scope.id) > 0; 
                });
                if(result.length > 0) {
                    var icons = {
                        error: "fire",
                        warning: "exclamation-sign",
                        info: "wrench"
                    }

                    var checkStyleInfoTemplate = function(value){ 
                        return '<div class="checkstyle-severity-' + value.$.severity  +'">'
                            + '<span class="glyphicon glyphicon-' + icons[value.$.severity]+ '"></span>'
                            + (value.$.column != undefined 
                                ?'<span class="checkstyle-column"> <b>Column</b>: ' + value.$.column + '</span>'
                                :'')
                            + '<span class="checkstyle-message"> <b>Message</b>:' + value.$.message + '</span>'
                            + '<span class="checkstyle-source"> <b>Source</b>: ' + value.$.source + '</span>'
                            + '</div>'
                    };
                    
                    angular.forEach(result[0].error, function(value, key){

                        if(parseInt(value.$.line) > 0 ) {
                            this.find('li').eq(parseInt(value.$.line) - 1)
                                .addClass('checkstyle-info')
                                .append(checkStyleInfoTemplate(value));
                        }else{
                            var $generalErrors = $(element).prev();
                            if($generalErrors.find('.none')) {
                                $generalErrors.find('.none').remove();
                            }
                            $generalErrors.find('ul.GeneralErrors').append('<li class="checkstyle-info">'
                                + checkStyleInfoTemplate(value)
                                + '</li>');
                        }
                    }, $(element));
                    $(element).prev().find('.ErrorCount').html(result[0].error.length);
                }

            });
        }
        };
    })
    .directive('scrollTo', function ($location, $anchorScroll) {
        return function(scope, element, attrs) {
            element.bind('click', function(event) {
                event.stopPropagation();
                var location = attrs.scrollTo;
                $location.hash(location);
                $anchorScroll();
            });

        };
    })
    .directive('legend', function($timeout) {
        return {
            restrict: 'E',
            scope: false,
            link: function postLink(scope, element, attrs) {
                $timeout(function () {
                    $(element).attr('id', $(element).html().replace(' ', ''));
                });
            }
        };
    });