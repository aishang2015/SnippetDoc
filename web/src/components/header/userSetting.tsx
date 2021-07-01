import { Avatar, Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { StorageService } from "../../common/storage";
import { updateUserAvatar } from "../../http/requests/account";
import { SimpleColorPicker } from "./simpleColorPicker";

export function UserSetting(props: any) {

    const [userForm] = Form.useForm();

    const [displayColor, setDisplayColor] = useState('#fde3cf');
    const [displayText, setDisplayText] = useState('A');

    useEffect(() => {
        userForm.resetFields();
        userForm.setFieldsValue({
            color: StorageService.getAvatarColor(),
            text: StorageService.getAvatarText()
        });
        setDisplayColor(StorageService.getAvatarColor()!);
        setDisplayText(StorageService.getAvatarText()!);
    }, []);

    async function submitUserInfo(values: any) {
        try {
            await updateUserAvatar({ avatarColor: values['color'], avatarText: values['text'] });
            StorageService.setUserInfo(values['color'], values['text']);
            props.onSubmit();
        } catch (e) {
            console.error(e);
        }
    }

    function selectColorChange(color: string) {
        setDisplayColor(color);
    }

    function textChange(value: any) {
        setDisplayText(value.target.value);
    }

    return (
        <>
            <Form form={userForm} onFinish={submitUserInfo}>
                <Form.Item label={"头像"} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                    <Avatar size={64} style={{ color: 'white', backgroundColor: displayColor, marginRight: '5px' }}>{displayText}</Avatar>
                </Form.Item>
                <Form.Item label={"头像背景色"} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} name="color">
                    <SimpleColorPicker onChange={selectColorChange}></SimpleColorPicker>
                </Form.Item>
                <Form.Item label={"显示内容"} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} name="text"
                    rules={[
                        { required: true, message: '请输入!' }
                    ]}>
                    <Input maxLength={2} autoComplete="off" onChange={textChange}></Input>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                    <Button htmlType="submit">确定</Button>
                </Form.Item>
            </Form>
        </>
    );
}