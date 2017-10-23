const request = require('supertest');
const app = require('../main/controller/restController');
const userRepository = {
    getCount: async () => {
        return 2;
    }
};
const logger = {
    info: () => {
    }
};

let appUnderTest = app(userRepository, 8081, logger);

test('test count', function (done) {
    request(appUnderTest)
        .get('/')
        .expect(200, "Count: 2")
        .end(function (err, res) {
            if (err) return done(err);
            done();
        });
});
