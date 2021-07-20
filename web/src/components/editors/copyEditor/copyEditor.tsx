import { Button, Form, Select, TreeSelect } from "antd";
import FormItem from "antd/lib/form/FormItem";
import Modal from "antd/lib/modal/Modal";
import { useEffect, useState } from "react";
import { EventUtil } from "../../../common/event";
import { TreeUtil } from "../../../common/tree-util";
import { DocRequests } from "../../../http/requests/doc";
import { FolderRequests } from "../../../http/requests/folder";
import { SpaceRequests } from "../../../http/requests/space";


export function CopyEditor() {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [spaceList, setSpaceList] = useState(new Array<any>());
    const [treeData, setTreeData] = useState(new Array<any>());
    const [docId, setDocId] = useState(0);

    useEffect(() => {
        initSpaceList();
        EventUtil.Subscribe("copyFile", openCopyModal);
        return () => {
            EventUtil.UnSubscribe("copyFile", openCopyModal);
        };
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    // 开启模态框
    function openCopyModal(params: any) {
        let [docId] = params;
        setDocId(docId);
        setVisible(true);
    }

    // 关闭模态框
    function closeCopyModal() {
        setVisible(false);
        form.resetFields();
    }

    // 取得空间列表
    async function initSpaceList() {
        try {
            let userSpaceResponse = await SpaceRequests.getUserManageSpaceList();
            setSpaceList(userSpaceResponse.data.data);
            await makeFolderTree(userSpaceResponse.data.data[0].id);
        } catch (e) {
            console.log(e);
        }
    }

    // 构造文件夹树
    async function makeFolderTree(spaceId: number) {
        try {
            let folderResponse = await FolderRequests.getFolderTree({ spaceId: spaceId });
            let tree = TreeUtil.MakeAntTreeKeyData(folderResponse.data.data, null);
            setTreeData(tree);
        } catch (e) {
            console.log(e);
        }
    }

    // 选择空间发生变化
    async function selectSpaceChange(value: number) {
        await makeFolderTree(value);
        form.resetFields(["folderId"]);
    }

    // 提交表单
    async function submitForm(values: any) {
        try {
            await DocRequests.copyDoc({
                spaceId: values['spaceId'],
                folderId: values["folderId"],
                docId: docId
            });
            closeCopyModal();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Modal visible={visible} footer={null} title="复制文档" destroyOnClose={true} onCancel={closeCopyModal}>
                <Form form={form} onFinish={submitForm}>
                    <FormItem name="spaceId" label="选择空间" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                        <Select onChange={selectSpaceChange} placeholder="请选择空间">
                            {spaceList.map(s => (
                                <Select.Option value={s.id} key={s.id}>{s.name}</Select.Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem name="folderId" label="选择文件夹" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                        <TreeSelect style={{ width: '100%' }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            allowClear placeholder="请选择文件夹" treeData={treeData}>
                        </TreeSelect>
                    </FormItem>
                    <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                        <Button htmlType="submit" style={{ marginRight: '10px' }}>复制</Button>
                        <Button htmlType="button" onClick={closeCopyModal}>取消</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}