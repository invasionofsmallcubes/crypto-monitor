const request = require('supertest');
const makeRestController = require('../main/controller/restController');
const userRepository = {
    getCount: async () => {
        return 2;
    }
};
const logger = {
    info: () => {
    }
};

let appUnderTest = null;

beforeEach(() => {
    appUnderTest = makeRestController(userRepository, 8081, logger);
});

afterEach((done) => {
    appUnderTest.close(done);
});

test('test count', function (done) {
    request(appUnderTest)
        .get('/')
        .expect(200, "Count: 2")
        .end(function (err, res) {
            if (err) return done(err);
            done();
        });
});
