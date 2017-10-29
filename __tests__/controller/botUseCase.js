const nock = require('nock');
const makeBotController = require('../../main/controller/botController');
const tbot = require('node-telegram-bot-api');

let bot = null;

const admin = {handle: jest.fn()};
const register = {handle: jest.fn()};
const deletion = {handle: jest.fn()};
const messageProvider = {send: jest.fn()};
const logger = {
    info: function (text) {
    }
};

beforeEach(() => {
    nock.disableNetConnect();

    nock('https://api.telegram.org')
        .post('/botTOKEN/getUpdates', 'offset=0&timeout=10')
        .reply(200,
            {
                ok: true,
                result: []
            });

    bot = new tbot('TOKEN', {polling: true});

});

afterEach((done) => {
    bot.stopPolling();
    done();
});

test('I can answer to \/ping', () => {
    const message = {
        message: {
            message_id: 207,
            from: {
                id: 24529653,
                is_bot: false,
                first_name: 'B',
                username: 'userA',
                language_code: 'en-CH'
            },
            chat: {
                id: 24529653,
                first_name: 'A',
                username: 'userA',
                type: 'private'
            },
            date: 1508417092,
            text: '\/ping',
            entities: [
                {
                    offset: 0,
                    length: 5,
                    type: 'bot_command'
                }
            ]
        }
    };

    makeBotController(bot, admin, register, deletion, messageProvider, logger);
    bot.processUpdate(message);

    expect(messageProvider.send.mock.calls.length).toBe(1);

});

test('I can answer to \/start', () => {
    const message = {
        message: {
            message_id: 207,
            from: {
                id: 24529653,
                is_bot: false,
                first_name: 'B',
                username: 'userA',
                language_code: 'en-CH'
            },
            chat: {
                id: 24529653,
                first_name: 'A',
                username: 'userA',
                type: 'private'
            },
            date: 1508417092,
            text: '\/start',
            entities: [
                {
                    offset: 0,
                    length: 5,
                    type: 'bot_command'
                }
            ]
        }
    };

    makeBotController(bot, admin, register, deletion, messageProvider, logger);
    bot.processUpdate(message);

    expect(register.handle.mock.calls.length).toBe(1);

});

test('I can answer to \/unsubscribe', () => {
    const message = {
        message: {
            message_id: 207,
            from: {
                id: 24529653,
                is_bot: false,
                first_name: 'B',
                username: 'userA',
                language_code: 'en-CH'
            },
            chat: {
                id: 24529653,
                first_name: 'A',
                username: 'userA',
                type: 'private'
            },
            date: 1508417092,
            text: '\/unsubscribe',
            entities: [
                {
                    offset: 0,
                    length: 5,
                    type: 'bot_command'
                }
            ]
        }
    };

    makeBotController(bot, admin, register, deletion, messageProvider, logger);
    bot.processUpdate(message);

    expect(deletion.handle.mock.calls.length).toBe(1);

});

test('I can answer to \/adminbardoculo password text', () => {
    const message = {
        message: {
            message_id: 207,
            from: {
                id: 24529653,
                is_bot: false,
                first_name: 'B',
                username: 'userA',
                language_code: 'en-CH'
            },
            chat: {
                id: 24529653,
                first_name: 'A',
                username: 'userA',
                type: 'private'
            },
            date: 1508417092,
            text: '\/adminbardoculo password text please join on http://www.google.com',
            entities: [
                {
                    offset: 0,
                    length: 5,
                    type: 'bot_command'
                }
            ]
        }
    };

    makeBotController(bot, admin, register, deletion, messageProvider, logger);
    bot.processUpdate(message);

    expect(admin.handle.mock.calls.length).toBe(1);
    expect(admin.handle.mock.calls[0][0]).toBe(24529653);
    expect(admin.handle.mock.calls[0][1]).toBe('password');
    expect(admin.handle.mock.calls[0][2]).toBe('text please join on http://www.google.com');


});