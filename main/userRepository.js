function makeUserRepository(db, logger) {
    return {
        getCount: async () => {
            console.log(db);
            return db.count();
        },
        findAllUsers: async () => {
            return db.chain.data();
        },
        findById: async (id) => {
            return db.findOne({chatId: id});
        },
        save: async (id) => {
            const usr = {chatId: id};
            db.insert(usr);
            db.saveDatabase(function (err) {
                if (err) {
                    logger.error(err);
                }
            });
            return {chatId: id};
        },
        delete: async (id) => {
            const usr = {chatId: id};
            db.remove(db.findOne(usr)); // check better usage on lokijs
            db.saveDatabase(function (err) {
                if (err) {
                    logger.error(err);
                }
            });
            return usr;
        }
    }
}

module.exports = makeUserRepository;