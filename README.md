*Learning Javascript via a Telegram BOT!*

Stuff to be done:

- ~use promises~
- install rethinkdb on raspberry pi 3
- ~implement `/start`~
- ~implement `/unsubscribe`~
- ~implement `/adminbardoculo`~
- ~use environment variables~
- ~implement `/adminbardoculo` with environment variables~
- split responsibilities!!
- integration tests

To create the default table:
```
r.dbCreate('beecoolit');
r.db('beecoolit').tableCreate('subscribers', {primaryKey: 'chatId'});
```