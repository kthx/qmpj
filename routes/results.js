var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var lineReader = require('line-reader');

router.get('/:resultId', function(req, res) {
	res.render('index', { title: 'Results JMV' });
});

router.get('/api/:resultId', function(req, res) {
    var resultId = req.params.resultId;
    var parser = new xml2js.Parser();
    var results = {};
    var cwd = process.cwd();
    var suffix = '.java';
    var resultsPath = cwd+ '/results/' + resultId + '/checkstyle/output.xml'
    var filesPath = cwd + '/results/' + resultId + '/files/';
    
    fs.exists(resultsPath, function(exists) {
        if (exists) {
            fs.readFile(resultsPath, function(err, data) {
                parser.parseString(data, function (err, checkstyleResults) {
                    checkstyleResults.checkstyle.file.forEach(function(item, index, array){
                        var fileName = item.$.name.replace(filesPath, '');
                        if(item.$.name.indexOf(suffix, item.$.name.length - suffix.length) !== -1) {
                            results[fileName] = {};
                            results[fileName].source = [];
                            lineReader.eachLine(item.$.name, function(line, last) {
                                results[fileName].source.push(line);
                                if(last && (index === array.length - 1)){
                                    res.json({ 
                                        currentUrl: '/results/' + resultId,
                                        title: 'JMV Results', 
                                        result: results, 
                                        checkstyleResults: checkstyleResults, 
                                    });
                                }
                            });
                        }
                    });
                });
            });
        } else {
            res.json({ 
                error: 'ResultNotFound',
                config: resultsPath
            });
        }
    });
});

module.exports = router;
