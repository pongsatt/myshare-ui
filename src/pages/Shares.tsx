import { Table } from "antd";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import AddressLink from "../components/AddressLink";
import { IRootState } from "../store";
import * as actions from '../store/shares/asyncActions';

class Shares extends React.Component<ReduxProps> {
    public columns = [
        {
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => <AddressLink address={text} onClick={this.addressClickHandler}/>,
            title: 'Contract Address',
        },
        {
            dataIndex: 'target',
            key: 'target',
            title: 'Target ETH',
        },
        {
            dataIndex: 'share',
            key: 'share',
            title: 'Number of Shares',
        },
        {
            dataIndex: 'startInDays',
            key: 'startInDays',
            title: 'Start Date',
        },
        {
            dataIndex: 'minInterest',
            key: 'minInterest',
            title: 'Mininum Interest ETH',
        }
    ];

    public addressClickHandler = (address: string) => {
        this.props.openShareDetail(address);
    }

    public async componentWillMount() {
        const { loadOpenShares, waitWeb3Connect } = this.props;
        await waitWeb3Connect();
        loadOpenShares();
    }

    public render() {
        const { openShares } = this.props;
        return (
            <React.Fragment>
                <h2>Avialable Shares</h2>
                <Table rowKey="address" columns={this.columns} dataSource={openShares} />
            </React.Fragment>
        );
    }
}

type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export function mapStateToProps({ shares }: IRootState) {
    const { openShares } = shares;
    return {
        openShares
    };
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        loadOpenShares: () => actions.loadOpenShares(dispatch),
        openShareDetail: (address: string) => actions.openShareDetail(dispatch, address),
        waitWeb3Connect: () => actions.waitWeb3Connect()
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Shares);