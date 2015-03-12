'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js'); 
 


exports.getCurrentConfig = function(req, res) { 
    var parser = new xml2js.Parser();
    var cwd = process.cwd();
    fs.readFile( cwd + '/config/checkstyle_config.xml', function(err, data) {
        parser.parseString(data, function (err, configContent) {
            var config = configContent;
            res.json({ 
                data: JSON.stringify(config)
            });
        });
    });
};

exports.restoreDefaultConfig = function(req, res) {
    var cwd = process.cwd();
    var fs = require('fs-extra');
    var defaultsPath = cwd + '/config/defaults.xml'
    var currentConfigPath =  cwd + '/config/checkstyle_config.xml'

    fs.copy(defaultsPath,currentConfigPath, function(err){
        res.json({
            success: !err,
            message: err
        });
    });
};

exports.saveCurrentConfig = function(req, res) {
    var builder = new xml2js.Builder({
        xmldec : { 
            'version': '1.0', 
            'encoding': 'UTF-8', 
            'standalone': false 
        },
        doctype : {
            pubID : "-//Puppy Crawl//DTD Check Configuration 1.3//EN",
            sysID : "http://www.puppycrawl.com/dtds/configuration_1_3.dtd"
        }
    });

    var xml = builder.buildObject(req.body);
    var cwd = process.cwd();
    var currentConfigPath =  cwd + '/config/checkstyle_config.xml'
    fs.writeFile(currentConfigPath, xml, 'utf-8', function(){
        res.json({
            success: true
        });
    })
};

exports.home = function(req, res) {
    res.render('index', { title: 'Results QMPJ' });
};