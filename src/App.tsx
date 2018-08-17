import { Button, Drawer, Layout, Spin } from 'antd';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import * as React from 'react';
import { connect } from "react-redux";
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import './App.css';
import AccountProfile from './containers/AccountProfile';
import ConnectError from './containers/ConnectError';
import Menus from './containers/Menus';
import ShareDetail from './containers/ShareDetail';
import MyParticipations from './pages/MyParticipations';
import MyShares from './pages/MyShares';
import NewShare from './pages/NewShare';
import Shares from './pages/Shares';
import { IRootState } from "./store";
import * as actions from './store/shares/asyncActions';

const LogoLayout = styled.h2`
  width: 120px;
  height: 31px;
  color: white;
  margin: 16px 28px 16px 0;
  line-height: 30px;
  float: left;
`;
const TokenLayout = styled.div`
  color: white;
  line-height: 30px;
  float: right;
`;

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  { icon: 'global', label: 'Avialable Shares', to: '/shares' },
  { icon: 'wallet', label: 'My Shares', to: '/myshares' },
  { icon: 'pie-chart', label: 'My Participation', to: '/mypart' },
];

interface IState {
  collapsed: boolean,
}

class App extends React.Component<ReduxProps & RouteComponentProps<any>, IState> {
  public state: IState = {
    collapsed: false,
  };

  public componentWillReceiveProps(nextProps: ReduxProps) {
    const {account} = this.props;

    if (account && account !== nextProps.account) {
      location.reload();
    }
  }

  public componentWillMount() {
    const {connectWeb3} = this.props;

    connectWeb3();
  }

  public onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }

  public onNewShare = () => {
    const { history } = this.props;
    history.push('newshare');
  }

  public onClose = () => {
    this.props.hideDetail();
  }

  public render() {
    const { showDetail, connecting } = this.props;

    return (
      <Spin spinning={connecting} size="large">
      <ConnectError/>
      <Layout>
        <Header>
          <LogoLayout>Share App</LogoLayout>
          <Button onClick={this.onNewShare}>New Share</Button>
          <TokenLayout>
            <AccountProfile />
          </TokenLayout>
        </Header>
        <Layout>
          <Sider
            collapsible={true}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menus items={menuItems} />
          </Sider>
          <Layout>
            <Content style={{ padding: '10px 10px', minHeight: 500, backgroundColor: 'white' }}>
              <Switch>
                <Route path="/shares" component={Shares} />
                <Route path="/myshares" component={MyShares} />
                <Route path="/mypart" component={MyParticipations} />
                <Route path="/newshare" component={NewShare} />
                <Redirect to="/shares" />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              pongsatt ©2018
            </Footer>
          </Layout>
          <Drawer
            title="Share"
            width={420}
            placement="right"
            onClose={this.onClose}
            maskClosable={true}
            visible={showDetail}
            style={{
              height: 'calc(100% - 55px)',
              overflow: 'auto',
              paddingBottom: 53,
            }}
          >
            <ShareDetail/>
          </Drawer>
        </Layout>
      </Layout>
      </Spin>
    );
  }
}

type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export function mapStateToProps({ shares }: IRootState) {
  const { showDetail, connecting, account } = shares;
  return {
    account,
    connecting, 
    showDetail
  };
}
export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    connectWeb3: () => actions.connectWeb3(dispatch),
    hideDetail: () => dispatch(actions.setShowDetail(false)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));