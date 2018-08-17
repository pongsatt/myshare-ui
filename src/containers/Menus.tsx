import { Icon, Menu } from 'antd';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom'

export interface IMenuItem {
    icon: string,
    label: string,
    to: string
}

export interface IMenusProps {
    items: IMenuItem[];
}

class Menus extends React.Component<IMenusProps & RouteComponentProps<any>> {
    public onMenuSelect = (menu: any) => {
        const {history} = this.props;
        history.push(menu.key);
    }

    public renderMenuItem = (menuItem: IMenuItem) => {
        const { icon, label, to } = menuItem;

        return (<Menu.Item key={to}>
            <Icon type={icon} />
            <span>{label}</span>
        </Menu.Item>);
    }

    public render() {
        const { items, location } = this.props;

        return (
            <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" onSelect={this.onMenuSelect}>
                {items.map(this.renderMenuItem)}
            </Menu>
        );
    }
}

export default withRouter(Menus);
