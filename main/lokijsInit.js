export function initCollection({db}) {
    return {
        init: async () => {
            let table = db.getCollection(TABLE);
            if (table === null) {
                table = db.addCollection(TABLE);
            }
            return table;
        }
    }
}