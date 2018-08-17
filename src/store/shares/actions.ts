import { action } from 'typesafe-actions';
import * as constants from './constants';
import { IShare, IShareParticipate } from './types';

export function setAccountInfo(account: string, token: number) {
    return action(constants.SET_ACCOUNT_INFO, {
        account,
        token
    });
}

export function setMyShares(myShares: IShareParticipate[]) {
    return action(constants.SET_MY_SHARES, {
        myShares
    });
}

export function setParticipationShares(participationShares: IShareParticipate[]) {
    return action(constants.SET_PARTICIPATION_SHARES, {
        participationShares
    });
}

export function setOpenShares(openShares: IShare[]) {
    return action(constants.SET_OPEN_SHARES, {
        openShares
    });
}

export function setShowDetail(showDetail: boolean) {
    return action(constants.SET_SHOW_DETAIL, {
        showDetail
    });
}

export function setShareDetail(share: IShare) {
    return action(constants.SET_SHARE_DETAIL, {
        share
    });
}

export function setConnecting(connecting: boolean, connectError?: string) {
    return action(constants.SET_CONNECTING, {
        connectError,
        connecting,
    });
}

export function addPendingTx(tx: string, address: string) {
    return action(constants.ADD_PENDING_TX, {
        address,
        tx,
    });
}

export function setPendingTransaction(pendingTransaction: boolean) {
    return action(constants.SET_PENDING_TX, {
        pendingTransaction,
    });
}