var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var cookie;

function loginUser() {
    return function(done) {
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



    

describe('Results route', function () {
    it('login', loginUser());

    it('results index return angular view', function (done) {
        this.timeout(20000);
        request(app)
            .get('/results/index')
            .set('cookie', cookie)
            .expect(200)
            .end(function (err, res) {
                (res.text.indexOf('ng-view') > -1).should.be.true;
                done()
            })
    });
    it('results index returns error when not found', function (done) {
        this.timeout(20000);
        request(app)
            .get('/results/api/doesNotExist')
            .send({newXmlContent: "searchMe"})
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.error == 'ResultNotFound').should.be.true;
                done();
            });
    });

    it('results api request runs without error', function (done) {
        this.timeout(20000);
        request(app)
            .get('/results/api/fixtureZip')
            .send({newXmlContent: "searchMe"})
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.title == 'QMPJ Results').should.be.true;
                done();
            });
    });

    it('results api request returns source code', function (done) {
        this.timeout(20000);
        request(app)
            .get('/results/api/fixtureZip')
            .send({newXmlContent: "searchMe"})
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                
                var result = res.body;

                (result.sourceCode[Object.keys(result.sourceCode)[0]].source.length > 0).should.be.true;
                done();
            });
    });

    it('results api request returns checkstyleResults', function (done) {
        this.timeout(20000);
        request(app)
            .get('/results/api/fixtureZip')
            .send({newXmlContent: "searchMe"})
            .set('cookie', cookie)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                
                var result = res.body;
                (result.checkstyleResults.checkstyle.file[0].error.length > 0).should.be.true;
                done();
            });
    });
});