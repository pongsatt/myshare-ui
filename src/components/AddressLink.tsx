import * as React from 'react';

export interface IAddressLinkProps {
    address: string
    onClick: (address: string) => void
}

export default class AddressLink extends React.PureComponent<IAddressLinkProps> {
    public onClick = () => {
        this.props.onClick(this.props.address);
    }

    public render() {
        const {address} = this.props;

        return (
            <a onClick={this.onClick}>{address}</a>
        );
    }
}