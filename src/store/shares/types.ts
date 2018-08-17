import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

export type ActionTypes = ActionType<typeof actions>;

export enum ShareStatus {
    Open = 0, WaitStart, WaitTransfer, WaitWithdraw, Closed, Cancelled, Tumbled
}

export enum ShareAction {
    Join = 0, Start, Transfer, Withdraw, Close, Cancel, Tumble
}

export enum ParticipantFields {
    addr = 0,
    lockedTokens,
    exists,
    isChaired,
    isBenefited,
    interestEth,
    paidRound
}

export interface IShare {
    address: string,
    chairman: string,
    target: number, 
    share: number, 
    startInDays: number, 
    minInterest: number,
    status?: number,
    actions?: ShareAction[],
    isParticipated?: boolean,
    participant?: any,
    beneficiary?: string,
    round?: number
}

export interface IShareParticipate {
    address: string,
    isChaired: boolean,
    tokens: number
}

export interface IPendingTx {
    [key: string]: string
}

export interface IShareState {
    account: string
    token: number
    myShares: IShareParticipate[]
    participationShares: IShareParticipate[]
    openShares: IShare[]
    share?: IShare
    showDetail: boolean
    connecting: boolean
    connectError?: string
    pendingTx: IPendingTx
    pendingTransaction: boolean
}