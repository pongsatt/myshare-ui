import { Button } from "antd";
import * as React from "react";
import styled from 'styled-components';
import { ButtonType } from "../../node_modules/antd/lib/button";

const ButtonLayout = styled.div`
    padding-right: 5px;
    display: inline;
`;

export interface IActionButtonProps {
    type?: ButtonType
    onClick?: () => void
}

export default class ActionButton extends React.PureComponent<IActionButtonProps> {
    public render() {
        const { onClick, children, type } = this.props;
    
        return (
            <ButtonLayout>
                <Button type={type} onClick={onClick}>
                    {children}
                </Button>
            </ButtonLayout>
        )
    }
}