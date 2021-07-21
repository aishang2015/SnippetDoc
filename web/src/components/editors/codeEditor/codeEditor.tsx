import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { EventUtil } from "../../../common/event";
import { TreeUtil } from "../../../common/tree-util";
import { FolderRequests } from "../../../http/requests/folder";
import { signalRUtil } from "../../common/signalr";
import { SaveOutlined } from '@ant-design/icons';
import { DocRequests } from "../../../http/requests/doc";
import MonacoEditor from "@monaco-editor/react";


export function CodeEditor(props: any) {

    const [editVisible, setEditVisible] = useState(false);
    const [treeData, setTreeData] = useState(new Array<any>());

    const [docId, setDocId] = useState(0);
    const [spaceId, setSpaceId] = useState(0);

    const [text, setText] = useState('');
    const [oldText, setOldText] = useState('');
    const [editForm] = Form.useForm();

    useEffect(() => {
        EventUtil.Subscribe("editCodeDoc", editCodeDoc);
        EventUtil.Subscribe("addCodeDoc", addCodeDoc);
        return () => {
            EventUtil.UnSubscribe("editCodeDoc", editCodeDoc);
            EventUtil.UnSubscribe("addCodeDoc", addCodeDoc);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 创建代码文档
    async function addCodeDoc(params: any) {
        let [spaceId] = params;
        setSpaceId(spaceId);

        await initFolderData(spaceId);
        editForm.resetFields();
        setText('');
        setEditVisible(true);
    }

    // 编辑代码文档
    async function editCodeDoc(params: any) {
        let [docId, spaceId] = params;
        setSpaceId(spaceId);
        setDocId(docId);

        await signalRUtil.stateConnection.invoke("BeginEdit", docId);
        
        try {
            await initFolderData(spaceId);
            let response = await DocRequests.getDoc({
                id: docId,
                historyId: null
            });
            editForm.setFieldsValue({
                docId: response.data.data.id,
                upFolderId: response.data.data.folderId,
                title: response.data.data.title
            });
            setText(response.data.data.content);
            setEditVisible(true);
        }
        catch (e) {
            console.error(e);
        }
    }

    // 初始化文件夹树
    async function initFolderData(spaceId: any) {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: spaceId });
            setTreeData(TreeUtil.MakeAntTreeData(response.data.data, null));
        } catch (e) {
            console.error(e);
        }
    }

    // 关闭模态框
    async function closeModal() {
        setEditVisible(false);
        await signalRUtil.stateConnection.invoke("EndEdit", docId);
    }

    // 输入内容变化
    function codeTextChange(newText: any, event: any) {
        setOldText(newText);
    }

    // 提交表单
    async function submitForm(values: any) {

        let docId = values['docId'];
        let upFolderId = values['upFolderId'];
        let title = values['title'];
        let content = oldText;
        try {
            if (docId === undefined) {

                // 添加新文档
                await DocRequests.createDoc({
                    spaceId: spaceId,
                    folderId: upFolderId,
                    docType: 2,
                    title: title,
                    content: content
                });
                setEditVisible(false);
            } else {

                // 更新文档
                await DocRequests.updateDoc({
                    id: docId,
                    title: title,
                    content: content
                });

            }
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Modal visible={editVisible} onCancel={closeModal} width={1100} title={"富文本文档编辑"} footer={null} destroyOnClose={true}
                maskClosable={false}>
                <Form wrapperCol={{ span: 24 }} onFinish={submitForm} form={editForm}>
                    <Form.Item>
                        <Button icon={<SaveOutlined />} htmlType="submit">保存</Button>
                    </Form.Item>
                    <Form.Item hidden name="docId">
                        <Input />
                    </Form.Item>
                    <Form.Item name="upFolderId">
                        <TreeSelect style={{ width: '100%' }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} allowClear
                            placeholder="请选择保存文件夹" treeData={treeData} >
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item name="title" rules={
                        [
                            { required: true, message: '请输入标题!' },
                            { max: 100, message: '标题太长!' }
                        ]
                    }>
                        <Input placeholder="请输入标题" maxLength={100} autoComplete="off"></Input>
                    </Form.Item>
                    <Form.Item name="content" style={{ border: '1px solid lightgray' }}>
                        <MonacoEditor
                            height="50vh"
                            language="csharp"
                            theme="light"
                            defaultValue={text}
                            onChange={codeTextChange}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}