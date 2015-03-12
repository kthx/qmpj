'use strict';

/* Filters */

var myQmpjFilters = angular.module('myQmpj.filters', [])
    .value('version', '0.1')
    .filter('onlyfieldsets', function(){
        return function(items) {
            var filtered = [];
            angular.forEach(items, function(item) {
                if(item.type == 'fieldset'){
                    this.push(item);
                }
            },filtered);
            return filtered;
        };
    })
    .filter('convertToGraph', function(){
        return function(items, type) {
            var rows = [];
            var cols = [];
            var template = {
                "type": "ColumnChart",
                "cssStyle": {
                    "height": "400px",
                    "width": "100%"
                },
                "data": {
                    "cols": cols,
                    "rows": rows
                },
                "options": {
                    "title": "Results per file and severity",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                        "title": "Amount",
                        "gridlines": {
                            "count": 6
                        }
                    },
                    "hAxis": {
                        "title": "Files"
                    }
                },
                "formatters": {},
                "displayed": true,
                "view": {
                  columns: [0,1,2,3]  
                } 
            };

            if(type == "pie" || type == "vBars") {

                angular.forEach(items, function(value, key) {  
                    var row = {
                        "c": [
                            {
                                "v": value.$.name.split('/')[value.$.name.split('/').length -1]
                            },
                            {
                                "v": $.grep(value.error, function(item){ return item.$.severity == "error"}).length
                            },
                            {
                                "v": $.grep(value.error, function(item){ return item.$.severity == "warning"}).length
                            },
                            {
                                "v": $.grep(value.error, function(item){ return item.$.severity == "info"}).length
                            },
                            {
                                "v": value.error.length
                            }
                        ]
                    };
                    this.push(row);
                }, rows);

                cols = [
                  {
                    "id": "file",
                    "label": "File",
                    "type": "string"
                  },
                  {
                    "id": "error",
                    "label": "Error",
                    "type": "number"
                  },
                  {
                    "id": "warning",
                    "label": "Warning",
                    "type": "number"
                  },
                  {
                    "id": "info",
                    "label": "Info",
                    "type": "number"
                  },
                  {
                    "id": "all",
                    "label": "All",
                    "type": "number"
                  }
                ];

            }
            if(type == "pie") {
                template.type = "PieChart";
                template.options.title = "Distribution results per file";

                template["view"] =  {
                    "columns": [
                      0,
                      4
                    ]
                };

            }
            if(type == "hBars") {
                template.type = "BarChart";
                template.rows = [];
                template.cols = [];
                template.options.title = "Results per file and check";
                template.options.hAxis.title = "Error count";
                template.options.vAxis.title = "Files";

                var cols = [
                    {
                        "id": "file",
                        "label": "File",
                        "type": "string",
                        "p": {}
                    }
                ];
                angular.forEach(items, function(value, key) { 
                    angular.forEach(value.error , function(error, key) { 
                        var col = {
                            "id": error.$.source,
                            "label": error.$.source.split('.')[error.$.source.split('.').length -1],
                            "type": "number",
                            "p": {}
                        }
                        if($.grep(this, function(n) { return col.id == n.id; }).length == 0){
                            this.push(col);
                        } 
                    }, cols);
                }, cols);

                angular.forEach(items, function(value, key) {  
                    var row = {
                        "c": [
                            {
                                "v": value.$.name.split('/')[value.$.name.split('/').length -1]
                            }
                        ]
                    };
                    angular.forEach(cols , function(col, key) { 
                        if(key > 0) {
                            this.c.push(
                                {
                                    "v": $.grep(value.error, function(item){ return item.$.source == col.id}).length
                                }
                            );
                        }
                    },row);
                    this.push(row);
                }, rows);

                
                template.cssStyle.height = (cols.length * 60) + "px",

                delete  template["view"];
            }

            if(type == "projectChart") {
                template.type = "LineChart";
                cols = [
                  {
                    "id": "revisionNumber",
                    "label": "Revision number",
                    "type": "string",
                  },
                  {
                    "id": "numberOfFiles",
                    "label": "Number of files",
                    "type": "number"
                  },
                  {
                    "id": "checkstyleInfo",
                    "label": "Checkstyle info",
                    "type": "number"
                  },
                  {
                    "id": "checkstyleWarning",
                    "label": "Checkstyle warning",
                    "type": "number"
                  },
                  {
                    "id": "checkstyleError",
                    "label": "Checkstyle error",
                    "type": "number"
                  },
                  {
                    "id": "jUnitAll",
                    "label": "JUnit all",
                    "type": "number"
                  },
                  {
                    "id": "jUnitError",
                    "label": "JUnit error",
                    "type": "number"
                  },
                  {
                    "id": "jUnitFail",
                    "label": "JUnit fail",
                    "type": "number"
                  },
                  {
                    "id": "jUnitSkipped",
                    "label": "JUnit skipped",
                    "type": "number"
                  },
                  {
                    "id": "jUnitTime",
                    "label": "JUnit time",
                    "type": "number"
                  },
                  
                ];
                angular.forEach(items.revisions, function(revision, key) {  
                    var row = {
                        "c": [
                            {
                                "v": revision.revisionNumber
                            },
                            {
                                "v": revision.filesCount
                            },
                            {
                                "v": revision.checkstyleInfo
                            },
                            {
                                "v": revision.checkstyleWarning
                            },
                            {
                                "v": revision.checkstyleError
                            },
                            {
                                "v": revision.unitTestsCount
                            },
                            {
                                "v": revision.erroredUnitTestsCount
                            },
                            {
                                "v": revision.failedUnitTestsCount
                            },
                            {
                                "v": revision.skippedUnitTestsCount
                            },
                            {
                                "v": revision.unitTestsTime
                            }
                            
                        ]
                    };
                    this.push(row);
                }, rows);


                template.cssStyle.height = "500px",
                template.cssStyle.width = "100%",
                template.options.title = items.title  + " overview";
                template.options.isStacked = true;
                template.options.fill = 20;
                template.options.displayExactValues = true;
                template.options.hAxis.title = "Revision no.";
                //template.options.vAxis.gridlines.count = rows.length;
                template.displayed = true;

                
                delete  template["view"];

            }
            template.data.cols = cols;
            template.data.rows = rows;      
            return template;
        };
    });