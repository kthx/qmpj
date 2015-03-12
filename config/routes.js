'use strict';

var path = require('path');
var auth = require('../config/auth');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var lineReader = require('line-reader');

module.exports = function(app) {

    // User Routes
    var users = require('../controllers/users');
    app.post('/auth/users', users.create);
    app.get('/auth/users/:userId', users.show);
    app.delete('/auth/users/:userId', users.destroy);
    app.param('userId', users.User);


    // Session Routes
    var session = require('../controllers/session');
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);

    // Project Routes
    var projects = require('../controllers/projects');
    app.get('/projects/api', projects.all);
    app.post('/projects/upload', auth.ensureAuthenticated, projects.upload);
    app.post('/projects/api', auth.ensureAuthenticated, projects.create);
    app.get('/projects/api/:projectId', projects.show);
    app.put('/projects/api/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.update);
    app.delete('/projects/api/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.destroy);
    app.param('projectId', projects.Project);

    // Result Routes
    var results = require('../controllers/results');
    app.get('/results/:resultId', auth.ensureAuthenticated, results.home);
    app.get('/results/api/:resultId', auth.ensureAuthenticated, results.show);

    // Config Routes
    var config = require('../controllers/config');
    app.get('/config', auth.ensureAuthenticated, config.home);   
    app.get('/config/api', auth.ensureAuthenticated, config.getCurrentConfig); 
    app.get('/config/api/defaults', auth.ensureAuthenticated, config.restoreDefaultConfig);
    app.post('/config/api', auth.ensureAuthenticated, config.saveCurrentConfig);

    // Angular Routes
    app.get('/partials/:name/:id?', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name );
    });


    app.get('/*', function(req, res) {
        console.log("generic route hit");
        if(req.user) {
          res.cookie('user', JSON.stringify(req.user.user_info));
        }

        res.render('index', { 
            title: 'QMPJ' ,
            message: [] 
        });
    });




}