'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var mkdirps = require('mkdirps');
var exec = require('child_process').exec
var fs = require('fs');
var unzip = require('unzip');
var glob = require("glob");
var async = require("async");
var xml2js = require('xml2js'); 
var cwd = process.cwd(); 

var randomString = function (len, bits){
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len){
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
};




var prepareUploadTask = function(req){
    return function (callback) {
        var currentFolder = randomString(12);

        var returnObj = { 
            path: currentFolder,
            error: null,
            filesCount: 0,
            checkstyleInfo: 0,
            checkstyleWarning: 0,
            checkstyleError: 0,
            unitTestsCount: 0,
            failedUnitTestsCount: 0,
            erroredUnitTestsCount: 0,
            skippedUnitTestsCount: 0,
            unitTestsTime: 0,
            success: false 
        };

        if(req.files) {
            mkdirps([
                './results/' + currentFolder + '/checkstyle/',
                './results/' + currentFolder + '/junit/',
                './results/' + currentFolder + '/files/'
            ], function(err) {
                if(err) {
                    returnObj.error = err;
                    callback(err, returnObj)
                }
                fs.rename(
                    req.files.file.path,
                    './results/' + currentFolder + '/files/' + req.files.file.originalname,
                    function(err){
                        if(err) {
                            returnObj.error = err;
                            callback(err, returnObj)
                        }else{
                            callback(null, req, currentFolder, returnObj);
                        }
                });
            });    

        }else{
            returnObj.error = "no files uploaded";
            callback(returnObj.error, returnObj)
            
        }
    };
};

var unzipFilesTask = function(req, currentFolder, returnObj, callback) {
    if(req.files.file.extension === 'zip') {
        fs.createReadStream('./results/' + currentFolder + '/files/' + req.files.file.originalname)
            .pipe(unzip.Extract({ path: './results/' + currentFolder + '/files/'  }))
            .on('finish', function(){
                fs.unlink('./results/' + currentFolder + '/files/' + req.files.file.originalname, function (err) {
                    if(err) {
                        returnObj.stderr = err;
                        callback(err, returnObj)
                    }
                    callback(null, req, currentFolder, returnObj)
                });
            });
    } else{
        callback(null, req, currentFolder, returnObj);
    }
};

var executeCheckStyleTask = function(req, currentFolder, returnObj, callback) {
    exec('/usr/bin/checkstyle -c ' + cwd + '/config/checkstyle_config.xml -f xml -o ' 
        + cwd + '/results/' + currentFolder + '/checkstyle/output.xml  \-r ' 
        + cwd + '/results/' + currentFolder + '/files/', function (error, stdout, stderr) {
        if(stderr && stdout) {
            callback(stderr, returnObj)
        }
        callback(null, req, currentFolder,returnObj)
    });
};

var readCheckStyleResultsTask = function(req, currentFolder, returnObj, callback) {
    var parser = new xml2js.Parser();
    fs.readFile( cwd + '/results/' + currentFolder + '/checkstyle/output.xml', function(err, data) {
        parser.parseString(data, function (err, checkstyleResults) {
            async.each(checkstyleResults.checkstyle.file, function(file, callback) {
                returnObj.filesCount++;
                returnObj.checkstyleInfo += file.error.filter(function(x){return x.$.severity === "info"}).length;
                returnObj.checkstyleWarning += file.error.filter(function(x){return x.$.severity === "warning"}).length;
                returnObj.checkstyleError += file.error.filter(function(x){return x.$.severity === "error"}).length;
                callback();
            }, function(err){
                if(err) {
                    returnObj.error = err;
                    callback(returnObj)
                }else {
                    callback(null, req, currentFolder,returnObj);
                }
            });
        });
    });
};

var compileJavaSourceCodeTask = function(req, currentFolder, returnObj, callback) {
    exec('find ' + cwd + '/results/' + currentFolder + '/files/' + ' -name "*.java" -print | xargs javac -g -classpath '
                            + '.:/usr/share/java/junit4-4.11.jar', function (error, stdout, stderr) {
        if(stderr) {
            returnObj.error = stderr;
            callback(stderr, returnObj);
        }
        callback(null, req, currentFolder,returnObj);
    });
};

var findUnitTestsTask = function(req, currentFolder,returnObj, callback) {
    glob('*test*.java', {
        cwd: cwd + '/results/' + currentFolder + '/files/',
        matchBase:true,
        nocase: true
    }, function (err, files) {
        if(err) {
            returnObj.error = err;
            callback(err, returnObj)
        }

        async.each(files, function(file, callback) {
            var fileName = file.split('/')[file.split('/').length-1];
            var className = fileName.replace('.java', '');
            var fullPathName =  cwd + '/results/' + currentFolder + '/files/' + file.replace(fileName, '') + '.';
            exec('java -classpath .:/usr/share/ant/lib/ant.jar'
                + ':' +  fullPathName
                + ':/usr/share/ant/lib/ant-junit.jar:/usr/share/java/junit4-4.11.jar '
                + 'org.apache.tools.ant.taskdefs.optional.junit.JUnitTestRunner '
                + className + ' formatter=org.apache.tools.ant.taskdefs.optional.junit.XMLJUnitResultFormatter'
                + ' > ' + cwd + '/results/' + currentFolder + '/junit/' + className + 'TestResult.xml', function (error, stdout, stderr) {
                    if(stderr) {
                        returnObj.error = stderr;
                        callback(stderr, returnObj);
                    } else {
                        fs.readFile( cwd + '/results/' + currentFolder + '/junit/' + className + 'TestResult.xml', function(err, data) {
                            var parser = new xml2js.Parser();
                            parser.parseString(data, function (err, junitResults) {
                                returnObj.unitTestsCount += parseInt(junitResults.testsuite.$.tests);
                                returnObj.failedUnitTestsCount += parseInt(junitResults.testsuite.$.failures);
                                returnObj.erroredUnitTestsCount += parseInt(junitResults.testsuite.$.errors);
                                returnObj.skippedUnitTestsCount += parseInt(junitResults.testsuite.$.skipped);
                                returnObj.unitTestsTime += parseFloat(junitResults.testsuite.$.time);
                                callback(null, returnObj);
                            });
                        });
                    }
                    
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

exports.upload = function(req, res) {   
    async.waterfall([
        prepareUploadTask(req),
        unzipFilesTask,
        executeCheckStyleTask,
        readCheckStyleResultsTask,
        compileJavaSourceCodeTask,
        findUnitTestsTask
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


exports.Project = function(req, res, next, id) {
  Project.load(id, function(err, Project) {
    if (err) return next(err);
    if (!Project) return next(new Error('Failed to load Project ' + id));
    req.Project = Project;
    next();
  });
};


exports.create = function(req, res) {
    var  Project = mongoose.model('Project');
    Project = new Project(req.body);
    Project.creator = req.user;

    Project.save(function(err) {
        if (err) {
          res.json(500, err);
        } else {
          res.json(Project);
        }
    });
};


exports.update = function(req, res) {
  var Project = req.Project;
  Project.revisions = req.body.revisions;
  Project.title = req.body.title;
  Project.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(Project);
    }
  });
};


exports.destroy = function(req, res) {
    var Project = req.Project;
    Project.remove(function(err) {
    if (err) {
        res.json(500, err);
    } else {
        res.json(Project);
    }
  });
};


exports.show = function(req, res) {
    res.json(req.Project);
};

exports.all = function(req, res) {
    Project.find({ creator: req.user._id }).sort('-created').exec(function(err, Projects) {
    if (err) {
        res.json(500, err);
    } else {
        res.json(Projects);
    }
    });
};
