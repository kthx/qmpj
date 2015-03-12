describe('myQmpj filters', function() {
    beforeEach(module("myQmpj.filters"));

    it('should return current version', inject(function(version) {
        expect(version).toEqual('0.1');
    }));

    it('has a onlyfieldsets filter', inject(function($filter) {
        expect($filter('onlyfieldsets')).not.toBeNull();
    }));

    describe('onlyfieldsets', function() {
        it('should convert object into array of only fieldsets', inject(function($filter) {
            var input = {
                a: {type: 'fieldset'},
                b: {type: 'fieldset'},
                c: {type: 'fieldset'},
                d: {type: 'button'}
            };

            var expectedResult = [
                {type: 'fieldset'},
                {type: 'fieldset'},
                {type: 'fieldset'}
            ];

            expect($filter('onlyfieldsets')(input)).toEqual(expectedResult);
        }));
    });


    it('has a convertToGraph filter', inject(function($filter) {
        expect($filter('convertToGraph')).not.toBeNull();
    }));

    describe('convertToGraph', function() {
        it('should convert errors into Grap', inject(function($filter) {
            var input = [
                {
                  "$":{
                     "name":"/root/prototype/jmv/results/R5WO86SSX1AI/files/src/server/application/Kunde.java"
                  },
                  "error":[
                     {
                        "$":{
                           "line":"0",
                           "severity":"warning",
                           "message":"Copyright is missing or malformed.",
                           "source":"com.puppycrawl.tools.checkstyle.checks.regexp.RegexpSinglelineCheck"
                        }
                     },
                     {
                        "$":{
                           "line":"3",
                           "severity":"error",
                           "message":"Missing a Javadoc comment.",
                           "source":"com.puppycrawl.tools.checkstyle.checks.javadoc.JavadocTypeCheck"
                        }
                     }
                  ]
                },
                {
                  "$":{
                     "name":"/root/prototype/jmv/results/R5WO86SSX1AI/files/src/server/application/ServerProtokoll.java"
                  },
                  "error":[
                     {
                        "$":{
                           "line":"0",
                           "severity":"warning",
                           "message":"Copyright is missing or malformed.",
                           "source":"com.puppycrawl.tools.checkstyle.checks.regexp.RegexpSinglelineCheck"
                        }
                     },
                     {
                        "$":{
                           "line":"6",
                           "severity":"error",
                           "message":"Missing a Javadoc comment.",
                           "source":"com.puppycrawl.tools.checkstyle.checks.javadoc.JavadocTypeCheck"
                        }
                     },
                     {
                        "$":{
                           "line":"8",
                           "column":"5",
                           "severity":"warning",
                           "message":"Cyclomatic Complexity is 9 (max allowed is 4).",
                           "source":"com.puppycrawl.tools.checkstyle.checks.metrics.CyclomaticComplexityCheck"
                        }
                     },
                     {
                        "$":{
                           "line":"14",
                           "severity":"error",
                           "message":"Line is longer than 100 characters.",
                           "source":"com.puppycrawl.tools.checkstyle.checks.sizes.LineLengthCheck"
                        }
                     }
                  ]
                }
            ];

            var pieResult = $filter('convertToGraph')(input , "pie");
            var hBarsResult = $filter('convertToGraph')(input , "hBars");
            var vBarsResult = $filter('convertToGraph')(input , "vBars");

            expect(pieResult["type"]).toEqual("PieChart");
            expect(pieResult["data"]["rows"].length).toEqual(2);
 
            expect(hBarsResult["type"]).toEqual("BarChart");
            expect(hBarsResult["data"]["rows"].length).toEqual(2);

            expect(vBarsResult["type"]).toEqual("ColumnChart");
            expect(vBarsResult["data"]["rows"].length).toEqual(2);
        }));
   });
});
