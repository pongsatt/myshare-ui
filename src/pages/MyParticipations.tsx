import { Table } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import AddressLink from "../components/AddressLink";
import { IRootState } from "../store";
import * as actions from '../store/shares/asyncActions';

class MyParticipations extends React.Component<ReduxProps> {
    public columns = [
        {
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => <AddressLink address={text} onClick={this.props.openShareDetail}/>,
            title: 'Contract Address',
        },
        {
            dataIndex: 'tokens',
            key: 'tokens',
            title: 'Used token',
        },
    ];

    public async componentWillMount() {
        const { loadParticipationShares, account, waitWeb3Connect } = this.props;
        await waitWeb3Connect();
        loadParticipationShares(account);
    }

    public render() {
        const { participationShares } = this.props;
        return (
            <React.Fragment>
                <h2>My Shares</h2>
                <Table rowKey="address" columns={this.columns} dataSource={participationShares} />
            </React.Fragment>
        );
    }
}

type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export function mapStateToProps({ shares }: IRootState) {
    const { participationShares, account } = shares;
    return {
        account,
        participationShares
    };
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        loadParticipationShares: (account: string) => actions.loadParticipationShares(dispatch, account),
        openShareDetail: (address: string) => actions.openShareDetail(dispatch, address),
        waitWeb3Connect: () => actions.waitWeb3Connect()
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyParticipations);