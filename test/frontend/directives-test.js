describe('myQmpj directives', function() {
    beforeEach(module("myQmpj.directives"));

    describe('google prettyprint directive', function() {

        beforeEach(inject(function($rootScope, $compile, $timeout) {
            scope = $rootScope.$new();

            element = '<pre class="prettyprint"><code class="language-java">{{(results.result[0].Kunde_java.source).join("\n")}}</code></pre>';
            scope.results = {
                result: [
                    { 
                        "Kunde_java" : {
                            source: [
                                'package server.application;\n ',
                                '\n ',
                                'public class Kunde {\n ',
                                '\n ',
                                'private String name;\n ',
                                '\n ',
                                '}\n '
                            ]
                        }  
                    }
                ]

            };

            scope['id'] = 'Kunde_java';    


            scope.$parent.cResults = {
                checkstyle: {
                    file: [{
                        '$': {
                            name: "__Kunde_java",
                        },
                        "error": [{
                            '$': {
                                "line": "1",
                                "severity": "warning",
                                "message": "Copyright is missing or malformed.",
                                "source": "com.puppycrawl.tools.checkstyle.checks.regexp.RegexpSinglelineCheck"
                            }
                        },
                        {
                            '$': {
                                "line": "3",
                                "column": "3",
                                "severity": "error",
                                "message": "Missing a Javadoc comment.",
                                "source": "com.puppycrawl.tools.checkstyle.checks.javadoc.JavadocTypeCheck"
                            }
                        }]
                    }]
                }
            };


            element = $compile(element)(scope);
            scope.$digest();
            $timeout.flush();
        }));

        it('prittyprint adds severity error object with message, source and column' , function(){
            var errorElem = element.find('.checkstyle-severity-error');
            expect(errorElem.length > 0).toBe(true);

            var errorMessage = errorElem.find('.checkstyle-message');
            var errorSource = errorElem.find('.checkstyle-source');
            var errorColumn = errorElem.find('.checkstyle-column');
            expect($(errorMessage[0]).text().indexOf("Missing a Javadoc comment.") > -1).toBe(true);
            expect($(errorSource[0]).text().indexOf("com.puppycrawl.tools.checkstyle.checks.javadoc.JavadocTypeCheck") > -1).toBe(true);
            expect($(errorColumn[0]).html().indexOf("3") > -1).toBe(true);
        });
        it('prittyprint adds severity warning object with message, source and no column', function(){
            var warningElem = element.find('.checkstyle-severity-warning');
            expect(warningElem.length > 0).toBe(true);

            var warningMessage = warningElem.find('.checkstyle-message');
            var warningSource = warningElem.find('.checkstyle-source');
            var warningColumn = warningElem.find('.checkstyle-column');
            expect($(warningMessage[0]).text().indexOf("Copyright is missing or malformed.") > -1).toBe(true);
            expect($(warningSource[0]).text().indexOf("com.puppycrawl.tools.checkstyle.checks.regexp.RegexpSinglelineCheck") > -1).toBe(true);
            expect($(warningColumn[0]).length == 0).toBe(true);
        });
   });

    describe('scroll to directive', function() {
        var $anchorScroll = jasmine.createSpy('anchorScroll');
        beforeEach(inject(function($rootScope, $compile, $location, $anchorScroll) {
            scope = $rootScope.$new();
            element = '<a href="" class="" scroll-to="test">test</a><br id="test" />';
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('scroll-to scrolls to id element' , function(){
            element.click(function(){
                expect($anchorScroll).toHaveBeenCalled();
            });
            
        });
    });
    describe('legend directive', function() {
        beforeEach(inject(function($rootScope, $compile, $location, $timeout) {
            scope = $rootScope.$new();
            element = '<legend>test</legend>';
            element = $compile(element)(scope);
            scope.$digest();
            $timeout.flush();
        }));

        it('legend gets id set from text' , function(){
            expect($(element).attr('id') == "test").toBe(true);
        });
    });

});
