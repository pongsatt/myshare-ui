import { Modal } from 'antd';
import * as React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '../store';

class ConnectError extends React.Component<ReduxProps> {
    public render() {
        const { connectError } = this.props;

        if (!connectError) {
            return null;
        }

        return (<Modal
            title="Error"
            visible={true}
            closable={false}
          >
            <span>Cannot connect to ethereum node. Please use Metamask.</span>
          </Modal>);
    }
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

export function mapStateToProps({ shares }: IRootState) {
    const { connectError } = shares;
    return {
        connectError,
    };
}

export default connect(mapStateToProps)(ConnectError);