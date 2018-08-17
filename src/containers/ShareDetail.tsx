import { Divider, Spin } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ActionButton from '../components/ActionButton';
import { IRootState } from '../store';
import * as actions from '../store/shares/asyncActions';
import { ShareAction } from '../store/shares/types';

class ShareDetail extends React.Component<ReduxProps> {
    public getAddress = () => {
        return this.props.share && this.props.share.address || '';
    }

    public join = () => {
        this.props.join(this.getAddress());
    }

    public start = () => {
        this.props.start(this.getAddress());
    }

    public transfer = () => {
        // this.props.transfer(this.getAddress());
    }

    public render() {
        if (!this.props.share) { return null; }

        const {pendingTransaction} = this.props;
        const {address, chairman, target, share, startInDays, minInterest, status} = this.props.share;
        const shareActions = this.props.share.actions;

        return (<Spin spinning={pendingTransaction}>
            <div><b>address:</b> {address}</div>
            <div><b>chairman:</b> {chairman}</div>
            <div><b>Target:</b> {target}</div>
            <div><b>Share:</b> {share}</div>
            <div><b>Start in days:</b> {startInDays}</div>
            <div><b>Min Interest:</b> {minInterest}</div>
            <div><b>Status:</b> {status}</div>
            <Divider/>
            {isAbleTo(ShareAction.Join, shareActions) && <ActionButton onClick={this.join}>Join</ActionButton>}
            {isAbleTo(ShareAction.Start, shareActions) && <ActionButton onClick={this.start}>Start</ActionButton>}
            {isAbleTo(ShareAction.Cancel, shareActions) && <ActionButton type="danger">Cancel This Share</ActionButton>}
            {isAbleTo(ShareAction.Close, shareActions) && <ActionButton>Close</ActionButton>}
            {isAbleTo(ShareAction.Withdraw, shareActions) && <ActionButton>Withdraw</ActionButton>}
            {isAbleTo(ShareAction.Transfer, shareActions) && <ActionButton onClick={this.transfer}>Transfer</ActionButton>}
            {isAbleTo(ShareAction.Tumble, shareActions) && <ActionButton>Tumble</ActionButton>}
        </Spin>);
    }
}

function isAbleTo(action: ShareAction, shareActions?: ShareAction[]) {
    if (shareActions && shareActions.indexOf(action) > -1) {
        return true;
    }
    return false;
}

type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export function mapStateToProps({ shares }: IRootState) {
    const { share, pendingTransaction } = shares;
    return {
        pendingTransaction,
        share,
    };
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        join: (address: string) => actions.join(dispatch, address),
        openShareDetail: (address: string) => actions.openShareDetail(dispatch, address),
        start: (address: string) => actions.start(dispatch, address),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareDetail);