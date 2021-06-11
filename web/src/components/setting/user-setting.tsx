import { Button, Form, Input, Modal, Pagination, Select, Space, Switch, Table, Tag } from "antd";
import { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';


export function UserSetting() {

    const [userForm] = Form.useForm();
    const [pwdForm] = Form.useForm();

    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);

    const [userModalVisible, setUserModalVisible] = useState(false);
    const [pwdModalVisible, setpwdModalVisible] = useState(false);

    const columns: any = [
        {
            title: '#',
            dataIndex: 'number',
            width: '50px',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '用户名',
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '角色',
            dataIndex: 'role',
            width: '110px',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '使用状态',
            dataIndex: 'isActive',
            width: '110px',
            align: 'center',
            render: (text: boolean) => {
                return text ? (<Tag color="success">使用中</Tag>) : (<Tag color="default">停用中</Tag>);
            }
        },
        {
            title: '操作',
            dataIndex: 'role',
            width: '250px',
            align: 'center',
            render: (text: any, record: any) => (
                <Space>
                    <a onClick={() => openUserModal(record.id)}>编辑信息</a>
                    <a onClick={() => openPwdModal()}>设置密码</a>
                    <a onClick={() => deleteUser(record.id)}>删除用户</a>
                </Space>
            )
        },
    ];

    let data = [
        {
            key: 1,
            number: 1,
            name: 'admin',
            isActive: true
        },
        {
            key: 2,
            number: 2,
            name: 'admin2',
            isActive: true
        }
    ];

    let pageChange = (page: number) => {
        setPage(page);
    };

    let sizeChange = (page: number, size: number) => {
        setPage(1);
        setSize(size);
    }

    let openUserModal = (id: number | null) => {
        setUserModalVisible(true);
        userForm.setFieldsValue({
            isActive: true
        });
    }

    let closeUserModal = () => {
        setUserModalVisible(false);
        userForm.resetFields();
    }

    // 提交用户信息
    let submitUserInfo = (values: any) => {
        let obj = {
            userName: values['userName'],
            role: values['role'],
            isActive: values['isActive'],
        }
    }

    // 提交密码信息
    let submitPwdInfo = (values: any) => {
        let obj = {
            password: values['password']
        }
    }

    let openPwdModal = () => {
        setpwdModalVisible(true);
    }

    let closePwdModal = () => {
        setpwdModalVisible(false);
        pwdForm.resetFields();
    }

    let deleteUser = (id: number) => {
        Modal.confirm({
            title: "确认删除",
            content: "删除后该用户将无法使用,确认删除?",
            onOk: () => {

            }
        });
    }

    return (
        <div>
            <Button style={{ marginTop: '10px' }} onClick={() => openUserModal(null)}><PlusOutlined />创建新用户</Button>
            <Table style={{ marginTop: '10px' }} columns={columns} dataSource={data} pagination={false}
                bordered />
            <Pagination style={{ marginTop: '10px' }} total={total} showTotal={(total, range) => `共${total} 条数据`}
                defaultPageSize={size} defaultCurrent={page} onChange={pageChange} onShowSizeChange={sizeChange} />
            <Modal visible={userModalVisible} onCancel={closeUserModal} footer={null} forceRender={true}>
                <Form form={userForm} style={{ marginTop: "20px" }} onFinish={submitUserInfo}>
                    <Form.Item label="用户名" name="userName" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }} rules={[
                        { required: true, message: '请输入用户名!' },
                        { max: 40, message: '用户名过长!' },
                    ]}>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label="角色" name="role" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }} rules={[
                        { required: true, message: '请选择角色!' }
                    ]}>
                        <Select placeholder="请选择角色" options={[{ value: '系统管理员', key: '1' }, { value: '普通用户', key: '2' }]} />
                    </Form.Item>
                    <Form.Item label="是否可用" name="isActive" valuePropName="checked" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }}>
                        <Switch />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: '6', span: '14' }}>
                        <Button type="primary" htmlType='submit'>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={pwdModalVisible} onCancel={closePwdModal} footer={null} forceRender={true} >
                <Form form={pwdForm} style={{ marginTop: "20px" }} onFinish={submitPwdInfo}>
                    <Form.Item label="新密码" name="password" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }} rules={[
                        { required: true, message: '请输入新密码!' },
                        { max: 100, message: '新密码过长!' },
                    ]}>
                        <Input type="password" placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: '6', span: '14' }}>
                        <Button type="primary" htmlType='submit'>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}