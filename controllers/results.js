'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var lineReader = require('line-reader');
var async = require('async');
var cwd = process.cwd();
var glob = require('glob');

exports.show = function(req, res) {   

    async.waterfall([
        readCheckstyleResultsTask(req),
        readSourceCodeTask,
        readUnitTestsResults
    ], function (err, result) {
        if(err) {
            res.json(result);
            res.end();
        }else{
            result.success = true;
            res.json(result);
            res.end();
        }  
    });
};

var readCheckstyleResultsTask  = function(req){
    return function (callback) {
        var parser = new xml2js.Parser();
        var resultId = req.params.resultId;
        
        var results = {};
        
        
        var resultsPath = cwd+ '/results/' + resultId + '/checkstyle/output.xml'
        var filesPath = cwd + '/results/' + resultId + '/files/';
        var returnObj = { 
            currentUrl: '/results/' + resultId,
            resultId:  resultId,
            title: 'QMPJ Results', 
            sourceCode: {}, 
            checkstyleResults: null,
            junit: {},
            success: false,
        };
        fs.exists(resultsPath, function(exists) {
            if (exists) {
                fs.readFile(resultsPath, function(err, data) {
                    parser.parseString(data, function (err, checkstyleResults) {
                        returnObj.checkstyleResults = checkstyleResults;
                        if(err) {
                            returnObj.error = err;
                            callback(err, returnObj)
                        }else{
                            callback(null, returnObj, filesPath);
                        }
                    });
                });
            }else{
                returnObj['error'] = 'ResultNotFound';
                callback("result not found", returnObj)
            }
        })
   }; 
};

var readSourceCodeTask = function(returnObj, filesPath, callback) {
    var suffix = '.java';
    returnObj.checkstyleResults.checkstyle.file.forEach(function(item, index, array){
        var fileName = 
            item.$.name.replace(filesPath, '').split('/')
            [item.$.name.replace(filesPath, '').split('/').length -1]
            .replace(suffix, '');
        if(item.$.name.indexOf(suffix, item.$.name.length - suffix.length) !== -1) {
            returnObj.sourceCode[fileName] = {};
            returnObj.sourceCode[fileName].source = [];
            lineReader.eachLine(item.$.name, function(line, last) {
                returnObj.sourceCode[fileName].source.push(line);
                if(last && (index === array.length - 1)){
                    callback(null, returnObj, filesPath);

                }
            });
        }
    });
    
};

var readUnitTestsResults = function(returnObj, filesPath, callback) {
    var testsPath = cwd + '/results/' + returnObj.resultId + '/junit/';

    glob('*.xml', {
        cwd: testsPath,
        matchBase:true,
        nocase: true
    }, function (err, files) {
        if(err) {
            returnObj.error = err;
            callback(err, returnObj)
        }

        async.each(files, function(file, callback) {
            var parser = new xml2js.Parser();
            fs.readFile(testsPath + file, function(err, data) {
                parser.parseString(data, function (err, junitResults) {
                    returnObj.junit[file.replace("TestResult.xml", '')] = junitResults;
                    callback();
                });
            });

        }, function(err){
            if(err) {
                returnObj.error = err;
                callback(err, returnObj)
            } else {
                callback(null, returnObj);
            }
        });
    });
    
};

exports.home = function(req, res) {
    res.render('index', { title: 'Results QMPJ' });
};
