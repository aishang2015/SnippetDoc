import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { TreeUtil } from "../../common/tree-util";
import { FolderRequests } from "../../http/requests/folder";


export function EditFolder(props: any) {

    const [folderForm] = Form.useForm();
    const [treeData, setTreeData] = useState(new Array<any>());

    useEffect(() => {
        initFolderData();
    }, [props.spaceId]);

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
            await FolderRequests.createFolder({ spaceId: props.spaceId, name: values['folderName'], upFolderId: values['up'] });
            await initFolderData();
            folderForm.resetFields();
        }
        catch (e) {
            console.error(e);
        }
        props.onCancel();
    }

    return (
        <>
            <Modal visible={props.visible} onCancel={props.onCancel} footer={null} width={700} title="编辑文件夹信息"
                destroyOnClose={true}>
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
                        <Button htmlType="button" onClick={() => props.onCancel()}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
