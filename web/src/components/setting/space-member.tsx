import { Button, Form, Input, Modal, Pagination, Select, Space, Table } from "antd";
import { UsergroupAddOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import { SpaceRequests } from "../../http/requests/space";
import { DebounceSelect } from "../select/debounce-select";
import { UserRequests } from "../../http/requests/user";
import { map } from 'lodash';
import { Constants } from "../../common/constant";
import { useSelector } from "react-redux";
import { RightUtil } from "../../common/right";

interface UserValue {
    label: string;
    value: string;
}

export function SpaceMember(props: any) {

    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [isSetRoleVisible, setIsSetRoleVisible] = useState(false);
    const [value, setValue] = React.useState<UserValue[]>([]);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);
    const [tableData, setTableData] = useState(new Array<any>());
    const [setMemberForm] = Form.useForm();
    const [setMemberRoleForm] = Form.useForm();

    const classifySelector = useSelector((state: any) => {
        return state.ClassifyReducer;
    });

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
            render: (text: number, record: any) => (
                <Space>
                    {
                        Constants.SpaceRoleDic[text]
                    }
                </Space>
            )
        },
        {
            title: '操作',
            dataIndex: 'role',
            width: '300px',
            align: 'center',
            render: (text: any, record: any) => (
                <>
                    {(classifySelector.spaceRole === 1 || RightUtil.IsSystemManage()) ?
                        <Space>
                            <a onClick={() => editMemberRole(record)}>修改角色</a>
                            <a onClick={() => removeSpaceMember(record.userName)}>移出成员</a>
                        </Space>
                        :
                        <span>无</span>
                    }
                </>
            )
        },
    ];

    let setSpaceMember = async () => {
        setIsEditVisible(true);
        await initData();
    }

    let initData = async (page = 1) => {
        let response = await SpaceRequests.getSpaceMemberList({ page: page, size: size, spaceId: props.spaceId });

        let data = [];
        let startNum = (page - 1) * size + 1;
        for (let iterator of response.data.data.pagedData) {
            data.push({
                number: startNum++,
                userName: iterator.memberName,
                spaceRole: iterator.memberRole
            });
        }
        setTableData(data);
        setTotal(response.data.data.total);
    }

    let pageChange = async (page: number) => {
        setPage(page);
        await initData(page);
    }

    let addMember = async () => {
        setIsSelectVisible(true);
        setMemberForm.resetFields();
    }

    let editMemberRole = async (record: any) => {
        setMemberRoleForm.resetFields();
        setMemberRoleForm.setFieldsValue({
            user: record.userName,
            role: record.spaceRole
        });
        setIsSetRoleVisible(true);
    }

    let removeSpaceMember = async (userName: string) => {
        Modal.confirm({
            title: '请确认',
            content: '是否移出该用户？',
            onOk: async () => {
                try {
                    await SpaceRequests.removeSpaceMember({ spaceId: props.spaceId, userName: userName });
                    await initData(page);
                } catch (e) {
                    console.error(e);
                }
            }
        });
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

    let submitMemberForm = async (values: any) => {
        try {
            await SpaceRequests.addSpaceMember({
                spaceId: props.spaceId,
                userName: values['user'].label,
                role: values['role']
            });
            setIsSelectVisible(false);
            await initData(page);
        } catch (e) {
            console.error(e);
        }
    }

    let submitMemberRoleForm = async (values: any) => {
        try {
            await SpaceRequests.updateSpaceMember({
                spaceId: props.spaceId,
                userName: values['user'],
                role: values['role']
            });
            setIsSetRoleVisible(false);
            await initData(page);
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <>
            <Button type="link" icon={<UsergroupAddOutlined />}
                onClick={setSpaceMember}></Button>
            <Modal visible={isEditVisible} footer={null} forceRender={true} title="设定空间成员"
                onCancel={() => setIsEditVisible(false)} width='1000px'>
                {(classifySelector.spaceRole === 1 || RightUtil.IsSystemManage()) &&
                    <Button style={{ marginBottom: '10px' }} onClick={addMember}><PlusOutlined />添加成员</Button>
                }
                <Table bordered pagination={false} style={{ marginBottom: '10px' }} columns={columns} dataSource={tableData}>

                </Table>
                <Pagination pageSize={size} current={page} defaultCurrent={page} showSizeChanger={false}
                    style={{ marginBottom: '10px' }} onChange={pageChange} total={total} />
            </Modal>
            <Modal visible={isSelectVisible} footer={null} forceRender={true} title="选择成员"
                onCancel={() => setIsSelectVisible(false)}>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} form={setMemberForm}
                    onFinish={submitMemberForm}>
                    <Form.Item label="选择用户" name="user" rules={[
                        { required: true, message: '请选择用户!' },
                    ]}>
                        <DebounceSelect fetchOptions={fetchUsers} placeholder="请选择用户"
                            showSearch
                            value={value}
                            onChange={newValue => {
                                setValue(newValue);
                            }} allowClear></DebounceSelect>
                    </Form.Item>
                    <Form.Item label="选择角色" name="role" rules={[
                        { required: true, message: '请选择角色!' },
                    ]}>
                        <Select placeholder="请选择角色">
                            <Select.Option value={1}>{Constants.SpaceRoleDic[1]}</Select.Option>
                            <Select.Option value={2}>{Constants.SpaceRoleDic[2]}</Select.Option>
                            <Select.Option value={3}>{Constants.SpaceRoleDic[3]}</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <Button htmlType='submit'>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={isSetRoleVisible} footer={null} forceRender={true} title="设置角色"
                onCancel={() => setIsSetRoleVisible(false)}>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} form={setMemberRoleForm}
                    onFinish={submitMemberRoleForm}>
                    <Form.Item label="用户" name="user">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="选择角色" name="role" rules={[
                        { required: true, message: '请选择角色!' },
                    ]}>
                        <Select placeholder="请选择角色">
                            <Select.Option value={1}>{Constants.SpaceRoleDic[1]}</Select.Option>
                            <Select.Option value={2}>{Constants.SpaceRoleDic[2]}</Select.Option>
                            <Select.Option value={3}>{Constants.SpaceRoleDic[3]}</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <Button htmlType='submit'>确定</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>

    )
}