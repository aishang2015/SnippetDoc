import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import { changePassword } from "../../http/requests/account";


export function PwdSetting(props: any) {

    const [pwdForm] = Form.useForm();
    const submitPwd = async (values: any) => {

        try {
            await changePassword({
                oldPassword: values['old'],
                confirmPassword: values['confirm'],
                newPassword: values['new']
            });
            props.onSubmit();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        pwdForm.resetFields();
    }, [pwdForm])

    return (
        <>
            <Form form={pwdForm} onFinish={submitPwd}>
                <Form.Item label={"旧密码"} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} name="old"
                    rules={[
                        { required: true, message: '请输入旧密码!' }
                    ]}>
                    <Input maxLength={30} autoComplete="off" type="password" placeholder="旧密码"></Input>
                </Form.Item>
                <Form.Item label={"确认旧密码"} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} name="confirm"
                    rules={[
                        { required: true, message: '请输入确认旧密码!' }
                    ]}>
                    <Input maxLength={30} autoComplete="off" type="password" placeholder="确认旧密码"></Input>
                </Form.Item>
                <Form.Item label={"新密码"} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} name="new"
                    rules={[
                        { required: true, message: '请输入新密码!' }
                    ]}>
                    <Input maxLength={30} autoComplete="off" type="password" placeholder="新密码"></Input>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                    <Button htmlType="submit">确定</Button>
                </Form.Item>
            </Form>
        </>
    );
}