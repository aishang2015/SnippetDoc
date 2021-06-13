import { Button, Form, Modal, Pagination, Select, Space, Table } from "antd";
import { UsergroupAddOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { SpaceRequests } from "../../http/requests/space";
import { DebounceSelect } from "../select/debounce-select";
import { UserRequests } from "../../http/requests/user";
import { map } from 'lodash';

interface UserValue {
    label: string;
    value: string;
}

export function SpaceMember(props: any) {

    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [value, setValue] = React.useState<UserValue[]>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [setMemberForm] = Form.useForm();

    const columns: any = [
        {
            title: '#',
            dataIndex: 'number',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            width: '300px',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '空间角色',
            dataIndex: 'spaceRole',
            width: '300px',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'role',
            width: '300px',
            align: 'center',
            render: (text: any, record: any) => (
                <Space>
                    <a onClick={() => { }}>移除用户</a>
                </Space>
            )
        },
    ];

    let setSpaceMember = async () => {
        setIsEditVisible(true);
        SpaceRequests.getSpaceMemberList({ page: page, size: size, spaceId: props.spaceId });
    }

    let addMember = async () => {
        setIsSelectVisible(true);
        setMemberForm.resetFields();
    }

    let fetchUsers = async (searchText: string) => {
        try {
            let result = await UserRequests.searchUserByName({ name: searchText });
            return map(result.data.data, function (d) {
                return {
                    label: d.userName,
                    value: d.userId
                }
            });
        } catch (e) {
            console.error(e);
        }
        return [];
    }

    let submitMemberForm = (values: any) => {

    }


    return (
        <>
            <Button type="link" icon={<UsergroupAddOutlined />}
                onClick={setSpaceMember}></Button>
            <Modal visible={isEditVisible} footer={null} forceRender={true} title="设定空间成员"
                onCancel={() => setIsEditVisible(false)} width='1000px'>
                <Button type="primary" style={{ marginBottom: '10px' }} onClick={addMember}>添加成员</Button>
                <Table bordered pagination={false} style={{ marginBottom: '10px' }} columns={columns}>

                </Table>
                <Pagination pageSize={size} style={{ marginBottom: '10px' }} />
            </Modal>
            <Modal visible={isSelectVisible} footer={null} forceRender={true} title="选择成员"
                onCancel={() => setIsSelectVisible(false)}>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} form={setMemberForm}
                    onFinish={submitMemberForm}>
                    <Form.Item label="选择用户">
                        <DebounceSelect fetchOptions={fetchUsers} placeholder="请选择用户"
                            showSearch
                            value={value}
                            onChange={newValue => {
                                setValue(newValue);
                            }} allowClear></DebounceSelect>
                    </Form.Item>
                    <Form.Item label="选择角色">
                        <Select placeholder="请选择角色">
                            <Select.Option value={1}>管理员</Select.Option>
                            <Select.Option value={2}>编辑者</Select.Option>
                            <Select.Option value={3}>观察者</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <Button>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>

    )
}