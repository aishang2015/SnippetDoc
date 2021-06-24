import { Button, Form, Input, Modal, Pagination, Select, Space, Switch, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { UserRequests } from "../../http/requests/user";


export function UserSetting() {

    const [userForm] = Form.useForm();
    const [pwdForm] = Form.useForm();

    const [total, setTotal] = useState(0);
    const [size] = useState(10);
    const [page, setPage] = useState(1);

    const [userModalVisible, setUserModalVisible] = useState(false);
    const [pwdModalVisible, setpwdModalVisible] = useState(false);

    // 提交状态
    const [isSubmiting, setIsSubmiting] = useState(false);

    // 用户表格数据
    const [userData, setUserData] = useState(new Array<{
        key: number,
        number: number,
        name: string,
        role: string,
        isActive: boolean
    }>());

    const [users, setUsers] = useState(new Array<{
        id: number,
        userName: string,
        roleId: number,
        role: string,
        isActive: boolean
    }>());

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
                    <a onClick={() => openUserModal(record.key)}>编辑信息</a>
                    <a onClick={() => openPwdModal(record.key)}>设置密码</a>
                    <a onClick={() => deleteUser(record.key)}>删除用户</a>
                </Space>
            )
        },
    ];

    let pageChange = async (page: number) => {
        setPage(page);
        await initData(page);
    };

    // 打开用户信息编辑框
    let openUserModal = (id: number | null) => {
        userForm.resetFields();
        setUserModalVisible(true);
        if (id === null) {
            userForm.setFieldsValue({
                isActive: false,
                userId: null
            });
        } else {
            let user = users.find(d => d.id === id);
            userForm.setFieldsValue({
                userName: user?.userName,
                isActive: user?.isActive,
                role: user?.roleId,
                userId: user?.id
            });
        }
    }

    // 提交用户信息
    async function submitUserInfo(values: any) {
        setIsSubmiting(true);
        let userId = values['userId'];
        try {
            if (userId !== undefined && userId !== null) {
                await UserRequests.updateUser({
                    userId: values['userId'],
                    userName: values['userName'],
                    role: values['role'],
                    isActive: values['isActive'],
                });
            } else {
                await UserRequests.createUser({
                    userName: values['userName'],
                    role: values['role'],
                    isActive: values['isActive'],
                });
            }
        } catch (e) {
            console.error(e);
            setIsSubmiting(false);
            return;
        }
        setIsSubmiting(false);
        setUserModalVisible(false);
        await initData(page);
    }

    // 提交密码信息
    async function submitPwdInfo(values: any) {

        setIsSubmiting(true);
        try {
            await UserRequests.setPassword({
                userId: values['userId'],
                password: values['password']
            });
        } catch (e) {
            console.error(e);
            setIsSubmiting(false);
            return;
        }
        setpwdModalVisible(false);
        setIsSubmiting(false);
    }

    // 打开密码编辑框
    function openPwdModal(id: number) {
        pwdForm.resetFields();
        pwdForm.setFieldsValue({
            userId: id,
            password: null
        });
        setpwdModalVisible(true);
    }

    let closePwdModal = () => {
        setpwdModalVisible(false);
        pwdForm.resetFields();
    }

    // 删除用户操作
    function deleteUser(id: number) {
        Modal.confirm({
            title: "确认删除",
            content: "删除后该用户将无法使用,确认删除?",
            onOk: async () => {
                try {
                    await UserRequests.deleteUser({ userId: id });
                } catch (e) {
                    console.error(e);
                    return;
                }
                await initData(page);
            }
        });
    }

    // 初始化数据
    async function initData(page = 1, size = 10) {
        try {
            let response = await UserRequests.getUserList({ page, size });
            //_users = response.data.data.pagedData;            
            setUsers(response.data.data.pagedData);
            let newData = [];
            let startNumber = (page - 1) * size + 1;
            for (let d of response.data.data.pagedData) {
                newData.push({
                    key: d.id,
                    number: startNumber++,
                    name: d.userName,
                    roleId: d.roleId,
                    role: d.role,
                    isActive: d.isActive
                });
            }
            setTotal(response.data.data.total);
            setUserData(newData);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        initData();
    }, []);

    return (
        <div>
            <Button style={{ marginTop: '10px' }} onClick={() => openUserModal(null)}><PlusOutlined />创建新用户</Button>
            <Table style={{ marginTop: '10px' }} columns={columns} dataSource={userData} pagination={false}
                bordered />
            <Pagination style={{ marginTop: '10px' }} total={total} showTotal={(total, range) => `共${total} 条数据`}
                defaultPageSize={size} defaultCurrent={page} current={page} onChange={pageChange} showSizeChanger={false} />
            <Modal visible={userModalVisible} onCancel={() => setUserModalVisible(false)} footer={null} forceRender={true}>
                <Form form={userForm} style={{ marginTop: "20px" }} onFinish={submitUserInfo}>
                    <Form.Item name="userId" hidden></Form.Item>
                    <Form.Item label="用户名" name="userName" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }} rules={[
                        { required: true, message: '请输入用户名!' },
                        { max: 40, message: '用户名过长!' },
                    ]}>
                        <Input placeholder="请输入用户名" autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="角色" name="role" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }} rules={[
                        { required: true, message: '请选择角色!' }
                    ]}>
                        <Select placeholder="请选择角色" options={[{ value: 1, label: '系统管理员' }, { value: 2, label: '普通用户' }]} />
                    </Form.Item>
                    <Form.Item label="是否可用" name="isActive" valuePropName="checked" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }}>
                        <Switch />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: '6', span: '14' }}>
                        <Button type="primary" htmlType='submit' loading={isSubmiting}>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={pwdModalVisible} onCancel={closePwdModal} footer={null} forceRender={true} >
                <Form form={pwdForm} style={{ marginTop: "20px" }} onFinish={submitPwdInfo}>
                    <Form.Item name="userId" hidden></Form.Item>
                    <Form.Item label="新密码" name="password" labelCol={{ span: '6' }} wrapperCol={{ span: '14' }} rules={[
                        { required: true, message: '请输入新密码!' },
                        { max: 100, message: '新密码过长!' },
                    ]}>
                        <Input type="password" placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: '6', span: '14' }}>
                        <Button type="primary" htmlType='submit' loading={isSubmiting}>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}