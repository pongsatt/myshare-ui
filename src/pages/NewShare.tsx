import {message} from 'antd';
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";
import MyShareForm from "../components/MyShareForm";
import * as actions from '../store/shares/asyncActions';
import { IShare } from "../store/shares/types";

class NewShare extends React.Component<ReduxProps & RouteComponentProps<any>> {
    public onSubmit = async (share: IShare) => {
        const {newShare} = this.props;
        const newShareAddr = await newShare(share)
        .catch(err => message.error('Error: ' + err));

        if (newShareAddr) {
            message.info('New share: ' + newShareAddr);
        }
    }

    public onCancel = () => {
        const {history} = this.props;
        history.goBack();
    }

    public render() {
        return (
            <React.Fragment>
                <h2>New Share</h2>
                <MyShareForm onSubmit={this.onSubmit} onCancel={this.onCancel}/>
            </React.Fragment>
        );
    }
}


type ReduxProps = ReturnType<typeof mapDispatchToProps>;

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        newShare: (share: IShare) => actions.newShare(dispatch, share),
    };
}

export default connect(null, mapDispatchToProps)(withRouter(NewShare));
