import * as React from "react";
import { Modal, Form, InputNumber } from "antd";
import { FormComponentProps } from "../../node_modules/antd/lib/form";

export interface IInterestFormProps {
    visible: boolean
    minInterest: number
    onCancel: () => void
    onOk: (interest: number) => void
}

export default Form.create()(
    class extends React.PureComponent<IInterestFormProps & FormComponentProps> {
        public onOk = () => {
            const {form, onOk} = this.props;

            form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    onOk(values.interest);
                    form.resetFields();
                }
            });
        }

        public render() {
            const { visible, onCancel, form, minInterest } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal title="What about interest?"
                    onCancel={onCancel}
                    onOk={this.onOk}
                    visible={visible}
                >
                    <Form layout="vertical">
                        <Form.Item label="Intestest">
                            {getFieldDecorator('interest', {
                                initialValue: minInterest,
                                rules: [{ required: true, message: 'This is required!' }],
                            })(
                                <InputNumber min={minInterest} autoFocus={true}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    });