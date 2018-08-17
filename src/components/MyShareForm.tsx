import { Button, DatePicker, Divider, Form, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as moment from 'moment';
import * as React from "react";
import styled from 'styled-components';
import { IShare } from '../store/shares/types';

const Layout = styled.div`
    width: 500px;
    text-align: left;
`;

interface IMyShareFormProps extends FormComponentProps {
    onSubmit: (share: IShare) => any
    onCancel: () => void
}

class MyShareForm extends React.PureComponent<IMyShareFormProps> {
    public handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err) {
                const {onSubmit} = this.props;
                const {startDate, ...rest} = values;

                const startInDays = (startDate as moment.Moment).startOf('d').diff(moment().startOf('d'), 'd');
                onSubmit({...rest, startInDays});
            }
        });
    }

    public disabledDate = (date: moment.Moment) => {
        if (date && date < moment()) {
            return true;
        }
        return false;
    }

    public render() {
        const {onCancel} = this.props;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        };
        const tailFormItemLayout = {
            wrapperCol: { span: 12, offset: 6 }
        };

        const config = {
            rules: [{ required: true, message: 'Required!' }]
        }

        return <Layout>
            <Form onSubmit={this.handleSubmit}>
                <Form.Item label="Target" {...formItemLayout}>
                    {getFieldDecorator('target', {
                        initialValue: 2, ...config
                    })(
                        <InputNumber  min={1} placeholder="ETH" />
                    )}
                </Form.Item>
                <Form.Item label="Share" {...formItemLayout}>
                    {getFieldDecorator('share', {
                        initialValue: 2, ...config
                    })(
                        <InputNumber  min={2} placeholder="Number of Share" />
                    )}
                </Form.Item>
                <Form.Item label="Start Date" {...formItemLayout}>
                    {getFieldDecorator('startDate', {
                        initialValue: moment().add(1, 'd'), ...config
                    })(
                        <DatePicker disabledDate={this.disabledDate}/>
                    )}
                </Form.Item>
                <Form.Item label="Min Interest" {...formItemLayout}>
                    {getFieldDecorator('minInterest', {
                        initialValue: 1, ...config
                    })(
                        <InputNumber min={1} placeholder="ETH" />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Create</Button>
                    <Divider type="vertical"/>
                    <Button type="default" onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </Layout>
    }
}

export default Form.create()(MyShareForm);