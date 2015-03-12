var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var cookie;
var projectId;

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


describe('Project route', function () {
    it('login', loginUser());

    it('returns " 500 - Bad request" error on faulty request', function (done) {
        this.timeout(20000);
        request(app)
            .post('/projects/api')
            .send({notAn: "ProjectObject"})
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(500)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                done();
            });
    });


    it('returns a project object after successfull project creation', function (done) {
        this.timeout(20000);
        request(app)
            .post('/projects/api')
            .send({
                title: "test213"
            })
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                projectId = res.body._id
                done();
            });
    });

});
describe('Upload route', function () {
    it('accepts upload of a zip', function (done) {
        this.timeout(20000);
        var cwd = process.cwd();
        request(app)
            .post('/projects/upload')
            .attach('file', cwd + '/fixtures/upload.zip')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.success).should.be.true;
        
        done()
      })
    });

    it('accepts upload of a single java file', function (done) {
        this.timeout(20000);
        var cwd = process.cwd();
        request(app)
            .post('/projects/upload')
            .attach('file', cwd + '/fixtures/upload.java')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                done();
              })
    });


    it('it returns a path where file has been copied to for single file', function (done) {
        this.timeout(20000);
        var cwd = process.cwd();
        request(app)
            .post('/projects/upload')
            .attach('file', cwd + '/fixtures/upload.java')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.path.length > 0).should.be.true;
                done();
            });
    });

    it('it return a path where the files have been copied to for a zip archive', function (done) {
        this.timeout(20000);
        var cwd = process.cwd();
        request(app)
            .post('/projects/upload')
            .attach('file', cwd + '/fixtures/upload.java')
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                var result = JSON.parse(res.text);
                (result.path.length > 0).should.be.true;
                done();
            });
    });

});

describe('Delete project route', function () {
    it('deletes project without error', function (done) {
        this.timeout(20000);
        request(app)
            .delete('/projects/api/' + projectId)
            .set('Accept', 'application/json')
            .set('cookie', cookie)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                done();
            });
    });
});
