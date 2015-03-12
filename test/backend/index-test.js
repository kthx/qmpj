var request = require('supertest');
var should = require('should');
var app = require('../../app.js');


describe('Index route', function () {
    it('returns angular view', function (done) {
        this.timeout(20000);
        request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                (res.text.indexOf('ng-view') > -1).should.be.true;
                done();
            });
        });
});