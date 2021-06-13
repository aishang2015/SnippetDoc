import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, PlusOutlined, DeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import './space-setting.less';
import { CreateSpaceModel, GetManageSpaceListResult, SpaceRequests, UpdateSpaceModel } from "../../http/requests/space";
import { SpaceMember } from "./space-member";


export function SpaceSetting() {

    const [spaces, setSpaces] = useState(new Array<GetManageSpaceListResult>());
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [editForm] = Form.useForm();


    useEffect(() => {
        initData();
    }, []);


    async function initData() {
        try {
            let spaces = await SpaceRequests.getManageSpaceList();
            setSpaces(spaces.data.data);
        }
        catch (e) {
            console.error(e);
        }
    }

    async function deleteSpace(id: number) {
        Modal.confirm({
            title: "确认",
            content: "是否删除该空间？",
            onOk: async () => {
                try {
                    await SpaceRequests.deleteSpace({ id: id });
                    await initData();
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    async function addSpace() {
        editForm.resetFields();
        setIsEditVisible(true);
    }

    async function editSpace(id: number) {
        editForm.resetFields();
        let spaceInfo = spaces.find(s => s.id === id);
        editForm.setFieldsValue({
            id: spaceInfo?.id,
            spaceName: spaceInfo?.name
        });
        setIsEditVisible(true);
    }

    async function submitEdit(values: any) {
        try {
            let id = values['id'];
            if (id !== undefined) {
                let postData: UpdateSpaceModel = {
                    id: id,
                    name: values['spaceName']
                }
                await SpaceRequests.updateSpace(postData);
            } else {
                let postData: CreateSpaceModel = {
                    name: values['spaceName']
                }
                await SpaceRequests.createSpace(postData);
            }
            setIsEditVisible(false);
            await initData();
        }
        catch (e) {
            console.error(e);
        }
    }


    return (
        <div className="space-container">
            <div className="space-card" style={{ justifyContent: 'center' }}>
                <Button block className="space-card-action" type="link" onClick={addSpace}
                    icon={<PlusOutlined style={{ fontSize: '1.5em', fontWeight: 'bold' }} />}></Button>
            </div>
            {
                spaces.map(space =>
                (
                    <div className="space-card">
                        <div className="space-card-title">
                            {space.name}
                        </div>
                        <div>
                            <Button type="link" icon={<DeleteOutlined />}
                                onClick={() => deleteSpace(space.id)}></Button>
                            <Button type="link" icon={<EditOutlined />}
                                onClick={() => editSpace(space.id)}></Button>
                            <SpaceMember spaceId={space.id}/>
                        </div>
                    </div>
                ))
            }
            <Modal visible={isEditVisible} forceRender={true} footer={null} onCancel={() => setIsEditVisible(false)}
                title="编辑用户信息">
                <Form form={editForm} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={submitEdit}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="spaceName" label={"空间名称"}>
                        <Input placeholder="请输入空间名称" autoComplete="off" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <Button htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}