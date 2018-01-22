// @flow

export default class Logger {
    error(message: string): void {
        console.log(message)
    }

    info(message: string): void {
        console.log(message)
    }
}

export function getLogger() : Logger {
    return new Logger();
}