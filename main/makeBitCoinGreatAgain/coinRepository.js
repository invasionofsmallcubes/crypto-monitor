// @flow

export class CoinProjection {
    hourlyDiff: number
    symbol: string
    volume: number
    when: Date
    constructor(hourlyDiff: number, symbol: string, volume: number, when: Date) {
        this.hourlyDiff = hourlyDiff
        this.symbol = symbol
        this.volume = volume
        this.when = when
    }
}

export class CoinRepository {
    client: any
    dbName: string
    documentName: string

    constructor(client: any, dbName: string, documentName: string) {
        this.client = client
        this.dbName = dbName
        this.documentName = documentName
    }

    async save(coin: any) {
        return this.client
            .db(this.dbName)
            .collection(this.documentName)
            .insertMany([coin]);
    }

    async findLast(name: string) : Promise<CoinProjection> {
        return this.client
            .db(this.dbName)
            .collection(this.documentName)
            .find({ symbol: name })
            .sort({ when: -1 })
            .limit(1)
            .toArray()
            .then((results) => {
                if (results.length !== 0) {
                    return new CoinProjection(
                        results[0].hourlyDiff,
                        results[0].symbol,
                        results[0].volume,
                        results[0].when)
                } else {
                    // probably better to fail
                    return undefined
                }
            });
    }

    async findLastRecordsAbout(name: string, limit: number) : Promise<CoinProjection> {
        return this.client
            .db(this.dbName)
            .collection(this.documentName)
            .find({ symbol: name })
            .sort({ when: -1 })
            .limit(limit)
            .toArray()
            .then((results) => {
                return results.map(r => {
                    return new CoinProjection(
                        r.hourlyDiff,
                        r.symbol,
                        r.volume,
                        r.when)
                });
            });
    }
}

export default function makeCoinRepository(client: any, dbName: string, documentName: string) {
    return new CoinRepository(client, dbName, documentName)
}