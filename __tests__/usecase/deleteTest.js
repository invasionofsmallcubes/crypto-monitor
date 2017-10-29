const makeDelete = require('../../main/usecase/delete');

let userRepository = null;
let messageProvider = null;
let logger = null;

beforeEach(() => {
    userRepository = {delete: jest.fn()};
    messageProvider = {send: jest.fn()};
    logger = {info: jest.fn()};
});

test('can delete user', function () {
    const deleted = makeDelete(userRepository, messageProvider, logger);

    deleted.handle(1);

    expect(logger.info.mock.calls.length).toBe(1);
    expect(userRepository.delete.mock.calls.length).toBe(1);
    expect(messageProvider.send.mock.calls.length).toBe(1);

});
