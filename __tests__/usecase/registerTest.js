const makeRegister = require('../../main/usecase/register');

let userRepository = null;
let messageProvider = null;
let logger = null;
let register = null;

beforeEach(() => {
    userRepository = {save: jest.fn(), findById: jest.fn()};
    messageProvider = {send: jest.fn()};
    logger = {info: jest.fn()};
    register = makeRegister(userRepository, messageProvider, logger);
});

test('can register non existing user', function () {

    register.handle(1);

    expect(logger.info.mock.calls.length).toBe(1);
    expect(userRepository.save.mock.calls.length).toBe(1);
    expect(messageProvider.send.mock.calls.length).toBe(1);
});

test('skip registering existing user', function () {

    userRepository.findById.mockReturnValueOnce({chatId: 1});

    register.handle(1);

    expect(logger.info.mock.calls.length).toBe(1);
    expect(userRepository.save.mock.calls.length).toBe(0);
    expect(messageProvider.send.mock.calls.length).toBe(1);
});