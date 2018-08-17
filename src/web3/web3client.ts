
const web3 = (window as any).web3;

const POLLING_TIME = 100;
const CONNECT_TIMEOUT = 3000;

function waitUntil(fn: () => any, cb: (result: any, error?: string) => void, timeCount: number = 0, polling: number = 0) {
    if (timeCount >= CONNECT_TIMEOUT) { return cb(null, 'Time out') };

    setTimeout(() => {
        const r1 = fn();
        if (r1 instanceof Promise) {
            r1.then(result => result && cb(result))
            .catch(err => cb(null, err));
        } else if (r1) { 
            return cb(r1);
        }
        else { 
            waitUntil(fn, cb, timeCount += POLLING_TIME, POLLING_TIME);
        }
    }, polling);
}

function waitUntilPromise(fn: () => any): Promise<any> {
    return new Promise((resolve, reject) => {
        waitUntil(fn, (result, error) => {
            if (error) { return reject(error) };
            resolve(result);
        })
    });
}

export function connect() {
    return waitUntilPromise(() => web3.isConnected() && web3.eth.defaultAccount);
}

export function onAccountChange(cb: (newAccount: string, account: string) => void) {
    let account = web3.eth.defaultAccount;
    setInterval(() => {
    if (web3.eth.defaultAccount !== account) {
        cb(web3.eth.defaultAccount, account);
        account = web3.eth.defaultAccount;
    }
    }, POLLING_TIME);
}

export function waitForReceipt(transactionHash: string) {
    return waitUntilPromise(() => promisify((f) => web3.eth.getTransactionReceipt(transactionHash, f)))
}

export function getContract(abi: object, address: string) {
    return web3.eth.contract(abi).at(address);
}

export function getAccount(): string {
    return web3.eth.defaultAccount;
}

export function promisify(fn: (cb: any) => any): Promise<any> {
    return new Promise((resolve, reject) => {
        fn((err: any, result: any) => {
            if (err) {
                return reject(err);
            }

            console.log('promisify result: ', result);
            resolve(result);
        });
    });
}

export type FilterStatus = 'latest' | 'pending';
export interface IFilterOptions {
    fromBlock?: string | number,
    toBlock?: string | number,
    address?: string,
    topics?: string[] | null
}

export function getFilterLogs(options: FilterStatus | IFilterOptions): Promise<any[]> {

    if (typeof options === 'object') {
        options.fromBlock = 0;
        options.toBlock = 'latest';

        if (!options.topics) {
            options.topics = null;
        }
    }

    // tslint:disable-next-line:no-console
    console.log('filterLogs filter: ', options);
    const filter = web3.eth.filter(options);

    return promisify((f) => filter.get(f));
}

export function watchEvents(events: any, cb: (error: any, result: any) => void) {
    events.watch((error: any, result: any) => {
        // tslint:disable-next-line:no-console
        console.log('watchEvents: ', error, result);
        cb(error, result);
    });
}

export function watchOnce(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
        watchEvents(event, (error, result) => {
            event.stopWatching();
            if (error) {
                return reject(error);
            }
            resolve(result);
        })
    });
}
