import * as constants from './constants';
import { ActionTypes, IShare, IShareState, ShareAction, ShareStatus } from './types';

const init: IShareState = {
  account: '',
  connecting: false,
  myShares: [],
  openShares: [],
  participationShares: [],
  pendingTransaction: false,
  pendingTx: {},
  showDetail: false,
  token: 0,
};

export function sharesReducer(state: IShareState = init, action: ActionTypes): IShareState {
  // tslint:disable-next-line:no-console
  // console.log('sharesReducer: ', type, payload);

  switch (action.type) {
    case constants.SET_ACCOUNT_INFO:
      return { ...state, ...action.payload };
    case constants.SET_MY_SHARES:
      return { ...state, ...action.payload };
    case constants.SET_PARTICIPATION_SHARES:
      return { ...state, ...action.payload };
    case constants.SET_OPEN_SHARES:
      return { ...state, ...action.payload };
    case constants.SET_CONNECTING:
      return { ...state, ...action.payload };
    case constants.SET_SHOW_DETAIL:
      return { ...state, ...action.payload };
    case constants.SET_SHARE_DETAIL:
      const actions = getShareActions(state, action.payload.share);
      const share = { ...action.payload.share, actions }
      return { ...state, share };
    case constants.ADD_PENDING_TX:
      const {tx, address} = action.payload;
      const newPendingTx = {[tx]: address};
      const pendingTx = Object.assign({}, state.pendingTx, newPendingTx);

      localStorage.setItem('pendingTx', JSON.stringify(pendingTx));
      return { ...state, pendingTx };
    case constants.SET_PENDING_TX:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function isParticipated(state: IShareState, share: IShare) {
  if (share.isParticipated) {
    return true;
  }

  return false;
}

function getShareActions(state: IShareState, share: IShare) {
  const actions: ShareAction[] = [];

  const { account } = state;
  const { chairman, beneficiary, status } = share;

  if (status === ShareStatus.Open) {
    if (!isParticipated(state, share)) {
      actions.push(ShareAction.Join);
    }

    if (account === chairman) {
      actions.push(ShareAction.Cancel);
    }
  }

  if (status === ShareStatus.WaitStart
    && account === chairman) {
    actions.push(ShareAction.Start);
  }

  if (status === ShareStatus.WaitTransfer
    && account !== beneficiary) {
    actions.push(ShareAction.Transfer);
  }

  if (status === ShareStatus.WaitWithdraw
    && account === beneficiary) {
    actions.push(ShareAction.Withdraw);
  }

  // tslint:disable-next-line:no-console
  console.log('getShareActions: ', actions);
  return actions;
}