*Writing a Telegram BOT and nodejs*

Stuff to be done:

- ~mongodb repository~
    - ~findLast with no value~
    - ~findLastHours~
    - ~findLastHours not found~
    - test with production connection (to check for mongodb version compatibility)
- integration, save last hour
- ~use promises~
- ~install rethinkdb on raspberry pi 3 (impossible to compile, switched to lokijs)~
- ~implement `/start`~
- ~implement `/unsubscribe`~
- ~implement `/adminbardoculo`~
- ~use environment variables~
- ~implement `/adminbardoculo` with environment variables~
- ~papertrail~
- ~split responsibilities!!~
- ~integration tests~
    - information that can be used to test the telegram bot:
        - since it's polling the call is:
            ```
            POST https://api.telegram.org/botTOKEN/getUpdates
            the response could be:
                empty-result: {"ok":true,"result":[]}
                result-with-message:
                    {
                      "ok": true,
                      "result": [
                        {
                          "update_id": 999318660,
                          "message": {
                            "message_id": 207,
                            "from": {
                              "id": 24529653,
                              "is_bot": false,
                              "first_name": "B",
                              "username": "userA",
                              "language_code": "en-CH"
                            },
                            "chat": {
                              "id": 24529653,
                              "first_name": "A",
                              "username": "userA",
                              "type": "private"
                            },
                            "date": 1508417092,
                            "text": "\/ping",
                            "entities": [
                              {
                                "offset": 0,
                                "length": 5,
                                "type": "bot_command"
                              }
                            ]
                          }
                        }
                      ]
                    }

            ```