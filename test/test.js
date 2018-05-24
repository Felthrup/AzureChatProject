var expect  = require('chai').expect;
var request = require('request');

it('Login page content', function(done) {
    request('http://localhost:3000/users/login' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Register page content', function(done) {
    request('http://localhost:3000/users/register' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});


