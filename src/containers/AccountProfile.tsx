import * as React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '../store';

class AccountProfile extends React.Component<ReduxProps> {
    public render() {
        const { account, token } = this.props;

        return (<React.Fragment>
            <div><b>Account:</b> {account}</div>
            <div><b>Token:</b> {token}</div>
        </React.Fragment>);
    }
}

type ReduxProps = ReturnType<typeof mapStateToProps>;

export function mapStateToProps({ shares }: IRootState) {
    const { token, account } = shares;
    return {
        account,
        token
    };
}

export default connect(mapStateToProps)(AccountProfile);