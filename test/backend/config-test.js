var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var cookie;

function loginUser() {
    return function (done) {
        request(app)
            .post('/auth/session')
            .send({ email: 'testuser@test.com', password: 'testpassword' })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            if (err) return done(err);
            cookie = res.headers['set-cookie'];
            return done();
        }
    };
};


describe('Config route', function () {

    it('login', loginUser());

    it('index action returns angular view', function (done) {
        this.timeout(20000);
        request(app)
            .get('/config')
            .set('cookie', cookie)
            .expect(200)
            .end(function (err, res) {
                (res.text.indexOf('ng-view') > -1).should.be.true;
                done()
            });
    });

    it('get call to api call returns configuration json', function (done) {
        request(app)
            .get('/config/api')
            .set('cookie', cookie)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.data).should.be.ok;
                done();
            });
    });
    
    

    it('posting xml as new config runs without error', function (done) {
        request(app)
            .post('/config/api/')
            .set('cookie', cookie)
            .send({newXmlContent: "searchMe"})
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.success).should.be.true;
                done();
            });
    });
    it('posting xml as new config saves new file to disk', function (done) {
        request(app)
            .post('/config/api/')
            .send({newXmlContent: "searchMe"})
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var cwd = process.cwd();
                var fs = require("fs");
                fs.readFile(cwd + '/config/checkstyle_config.xml', "utf8", function (err, data) {
                    (data.indexOf('searchMe') > 0).should.be.true;
                    done();

                });
            });
    });

    it('default restore runs without error', function (done) {
        request(app)
            .get('/config/api/defaults')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.success).should.be.true;
                done();
            });
    });
});