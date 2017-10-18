function initCollection(db, TABLE) {
    let table = db.getCollection(TABLE);
    if (table === null) {
        table = db.addCollection(TABLE);
    }
    return table;
}

module.exports = initCollection;