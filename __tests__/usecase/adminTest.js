const makeAdmin = require('../../main/usecase/admin');

let userRepository = null;
let messageProvider = null;
let logger = null;

beforeEach(() => {
    userRepository = {findAllUsers: jest.fn(), getCount: jest.fn()};
    messageProvider = {send: jest.fn()};
    logger = {error: jest.fn()};
});


test('can send message', function () {
    const admin = makeAdmin('PASS', userRepository, messageProvider, logger);

    userRepository.findAllUsers.mockReturnValueOnce([{chatId: 10}]);
    userRepository.getCount.mockReturnValueOnce(1);

    admin.handle(1, 'PASS', 'message');

    expect(messageProvider.send.mock.calls.length).toBe(2);
    expect(messageProvider.send.mock.calls[0][0]).toBe(10);
    expect(messageProvider.send.mock.calls[1][0]).toBe(1);

});

test('cannot send message', function () {
    const admin = makeAdmin('PASS1', userRepository, messageProvider, logger);

    admin.handle(1, 'PASS', 'message');

    expect(messageProvider.send.mock.calls.length).toBe(1);

});