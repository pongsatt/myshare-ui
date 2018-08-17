import { Dispatch } from 'redux';
import * as web3service from '../../web3/web3service';
import {
    addPendingTx,
    setAccountInfo,
    setConnecting,
    setMyShares, 
    setOpenShares, 
    setParticipationShares, 
    setPendingTransaction, 
    setShareDetail, 
    setShowDetail
} from './actions';
import { ActionTypes, IShare } from './types';
export * from './actions';

export async function loadAccountInfo(dispatch: Dispatch<ActionTypes>, address?: string) {
    const account = address || web3service.getAccount();
    const token = await web3service.getToken(account);
    dispatch(setAccountInfo(account, token));
}

export async function loadMyShares(dispatch: Dispatch<ActionTypes>, account: string) {
    const myShares = await web3service.getParticipatedEvents(true, account);
    dispatch(setMyShares(myShares));
}

export async function loadParticipationShares(dispatch: Dispatch<ActionTypes>, account: string) {
    const shares = await web3service.getParticipatedEvents(false, account);
    dispatch(setParticipationShares(shares));
}

export async function loadOpenShares(dispatch: Dispatch<ActionTypes>) {
    const openShares = await web3service.getShareCreatedEvents();
    dispatch(setOpenShares(openShares));
}

export async function openShareDetail(dispatch: Dispatch<ActionTypes>, address: string) {
    dispatch(setShowDetail(true));

    const share = await web3service.getShareDetail(address);

    // tslint:disable-next-line:no-console
    console.log('openShareDetail: ', share);
    dispatch(setShareDetail(share));
}

export async function join(dispatch: Dispatch<ActionTypes>, address: string) {
    dispatch(setPendingTransaction(true));

    const receipt = await web3service.join(address)
        .catch(tx => {
            // tslint:disable-next-line:no-console
            console.log('join tx: ',tx);
            dispatch(addPendingTx(tx, address))
        });

    // tslint:disable-next-line:no-console
    console.log('join receipt: ',receipt);

    dispatch(setPendingTransaction(false));
}

export async function start(dispatch: Dispatch<ActionTypes>, address: string) {
    return await web3service.start(address);
}

export async function waitWeb3Connect() {
    return await web3service.connect();
}

export async function connectWeb3(dispatch: Dispatch<ActionTypes>) {
    dispatch(setConnecting(true));

    return web3service.connect()
        .then(() => {
            dispatch(setConnecting(false));
            loadAccountInfo(dispatch);
            monitorAccountChange(dispatch);
            return true;
        })
        .catch((error) => {
            dispatch(setConnecting(false, error));
            return false;
        });
}

export async function monitorAccountChange(dispatch: Dispatch<ActionTypes>) {
    web3service.onAccountChange((newAccount) => {
        loadAccountInfo(dispatch, newAccount);
    });
}

export async function newShare(dispatch: Dispatch<ActionTypes>, share: IShare) {
    const newShareAddr = await web3service.createNewShare(share);
    return newShareAddr;
}