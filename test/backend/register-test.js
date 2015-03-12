var request = require('supertest');
var should = require('should');
var app = require('../../app.js');

var userId = '';
describe('Register route', function () {
    it('returns " 400 - Bad request" error on faulty request', function (done) {
        this.timeout(20000);
        request(app)
            .post('/auth/users')
            .send({notAn: "UserObject"})
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                done();
            });
    });

    it('returns validation Error for missing username', function (done) {
        this.timeout(20000);
        request(app)
            .post('/auth/users')
            .send({notAn: "UserObject"})
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                (res.body.errors.username.name).should.be.equal('ValidatorError');
                (res.body.errors.username.type).should.be.equal('required');
                done();
            });
    });

    it('returns Error for missing password', function (done) {
        this.timeout(20000);
        request(app)
            .post('/auth/users')
            .send({
                username: "test",
                email: "test@test.com"
            })
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                done();
            });
    });

    it('returns validation Error for missing email', function (done) {
        this.timeout(20000);
        request(app)
            .post('/auth/users')
            .send({notAn: "UserObject"})
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                (res.body.errors.email.name).should.be.equal('ValidatorError');
                (res.body.errors.email.type).should.be.equal('required');
                done();
            });
    });

    it('returns a user object after successfull user creation', function (done) {
        this.timeout(20000);
        request(app)
            .post('/auth/users')
            .send({
                username: "test2213",
                email: "test4121@test.com",
                password: "123"
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                userId = res.body._id;
                done();
            });
    });
});

describe('Delete User route', function () {
    it('deletes User Obj', function (done) {
        this.timeout(20000);
        request(app)
            .delete('/auth/users/' + userId)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                done();
            });
    });
});