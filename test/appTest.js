const request = require('supertest');
const app = require('../main/app');

describe('The service', function() {
    describe ('has /', function() {
        it('status', function(done){
            request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              done();
            });
          });
          it('status with body', function(done){
              request(app)
              .get('/')
              .expect(200, "Hello World")
              .end(function(err, res) {
                if (err) return done(err);
                done();
              });
            });
        });
      });
