const request = require('supertest');
const app = require('../main/controller');
const userRepository = {
    getCount: async () => {
        return 2;
    }
};
const logger = {
    info: () => {
    }
};

describe('The service', function() {

    let appUnderTest = app(userRepository, 8081, logger);

    describe ('has /', function() {
        it('status', function(done){
            request(appUnderTest)
            .get('/')
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              done();
            });
          });
          it('status with body', function(done){
              request(appUnderTest)
              .get('/')
              .expect(200, "Count: 2")
              .end(function(err, res) {
                if (err) return done(err);
                done();
              });
            });
        });
      });
