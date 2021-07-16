import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { TreeUtil } from "../../../common/tree-util";
import { FolderRequests } from "../../../http/requests/folder";
import { EventUtil } from "../../../common/event";


export function EditFolder() {

    const [folderForm] = Form.useForm();
    const [treeData, setTreeData] = useState(new Array<any>());

    const [modalVisible, setModalVisible] = useState(false);

    const [currentSpaceId, setCurrentSpaceId] = useState(0);
    const [currentFolderId, setCurrentFolderId] = useState(0);

    useEffect(() => {
        EventUtil.Subscribe("editFolder", modifyFolder);
        EventUtil.Subscribe("addFolder", addNewFolder);
        return () => {
            EventUtil.UnSubscribe("editFolder", modifyFolder);
            EventUtil.UnSubscribe("addFolder", addNewFolder);
        };
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    async function addNewFolder(params: any) {
        let [spaceId] = params;
        setCurrentSpaceId(spaceId);
        await initFolderData(spaceId);
        setModalVisible(true);
    }

    async function modifyFolder(params: any) {
        let [folderId, spaceId] = params;
        setCurrentFolderId(folderId);
        setCurrentSpaceId(spaceId);
        try {
            await initFolderData(spaceId);
            let response = await FolderRequests.getFolder({ folderId: folderId });
            folderForm.resetFields();
            folderForm.setFieldsValue({
                folderId: folderId,
                up: response.data.data.upId,
                folderName: response.data.data.name
            });
        } catch (e) {
            console.error(e);
        }

        setModalVisible(true);
    }


    async function initFolderData(spaceId: any) {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: spaceId });
            setTreeData(TreeUtil.MakeAntTreeData(response.data.data, null));
        } catch (e) {
            console.error(e);
        }
    }

    async function submitForm(values: any) {
        try {
            if (values['folderId'] === undefined) {
                await FolderRequests.createFolder({ spaceId: currentSpaceId, name: values['folderName'], upFolderId: values['up'] });
            } else {
                await FolderRequests.updateFolder({ spaceId: currentSpaceId, folderId: currentFolderId, name: values['folderName'], upFolderId: values['up'] })
            }
            folderForm.resetFields();
            EventUtil.EventEmitterInstance().emit('folderChange', true);
        }
        catch (e) {
            console.error(e);
        }
        setModalVisible(false);
    }

    function closeEditModal() {
        setModalVisible(false);
        folderForm.resetFields();
    }

    return (
        <>
            <Modal visible={modalVisible} onCancel={closeEditModal} footer={null} width={700} title="编辑文件夹信息">
                <Form form={folderForm} onFinish={submitForm}>
                    <Form.Item name="folderId" hidden>
                        <Input />
                    </Form.Item>
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
