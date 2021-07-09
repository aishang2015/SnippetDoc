import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useState } from "react";
import { TreeUtil } from "../../../common/tree-util";
import { FolderRequests } from "../../../http/requests/folder";
import { FolderOutlined, EditOutlined } from '@ant-design/icons';
import { EventUtil } from "../../../common/event";


export function EditFolder(props: any) {

    const [folderForm] = Form.useForm();
    const [treeData, setTreeData] = useState(new Array<any>());

    const [modalVisible, setModalVisible] = useState(false);

    async function initFolderData() {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: props.spaceId });
            setTreeData(TreeUtil.MakeAntTreeData(response.data.data, null));
        } catch (e) {
            console.error(e);
        }
    }

    async function submitForm(values: any) {
        try {
            if (props.folderId === undefined) {
                await FolderRequests.createFolder({ spaceId: props.spaceId, name: values['folderName'], upFolderId: values['up'] });
            } else {
                await FolderRequests.updateFolder({ folderId: props.folderId, spaceId: props.spaceId, name: values['folderName'], upFolderId: values['up'] })
            }
            await initFolderData();
            folderForm.resetFields();
            EventUtil.EventEmitterInstance().emit('folderChange', true);
        }
        catch (e) {
            console.error(e);
        }
        setModalVisible(false);
    }

    async function addNewFolder() {
        await initFolderData();
        setModalVisible(true);
    }

    async function modifyFolder() {
        try {
            await initFolderData();
            let response = await FolderRequests.getFolder({ folderId: props.folderId });
            folderForm.resetFields();
            folderForm.setFieldsValue({
                up: response.data.data.upId,
                folderName: response.data.data.name
            });
        } catch (e) {
            console.error(e);
        }

        setModalVisible(true);
    }

    function closeEditModal() {
        setModalVisible(false);
        folderForm.resetFields();
    }

    return (
        <>
            {props.folderId === undefined ?
                <div className="file-type-item" onClick={addNewFolder}>
                    <FolderOutlined style={{ fontSize: '60px' }} />
                    <span>文件夹</span>
                </div>
                :
                <Button style={{ marginRight: '10px' }} icon={<EditOutlined />} onClick={modifyFolder}>修改</Button>
            }
            <Modal visible={modalVisible} onCancel={closeEditModal} footer={null} width={700} title="编辑文件夹信息">
                <Form form={folderForm} onFinish={submitForm}>
                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} label="上级文件夹" name="up">
                        <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            allowClear
                            placeholder="请选择上级文件夹"
                            treeData={treeData}>
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} label="文件夹名称" name="folderName"
                        rules={[
                            { required: true, message: '请输入文件夹名!' },
                            { max: 30, message: '文件夹名过长!' }
                        ]}>
                        <Input maxLength={30} placeholder="请输入文件夹名" autoComplete="off" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                        <Button htmlType="submit" style={{ marginRight: '10px' }}>提交</Button>
                        <Button htmlType="button" onClick={closeEditModal}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
