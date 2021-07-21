import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { EventUtil } from "../../../common/event";
import { DocRequests } from "../../../http/requests/doc";
import { signalRUtil } from "../../common/signalr";
import { SaveOutlined } from '@ant-design/icons';
import { FolderRequests } from "../../../http/requests/folder";
import { TreeUtil } from "../../../common/tree-util";
import ReactMarkdown from 'react-markdown';
import MonacoEditor from "@monaco-editor/react";


export function MarkdownEditor() {

    const [editVisible, setEditVisible] = useState(false);
    const [treeData, setTreeData] = useState(new Array<any>());
    const [docId, setDocId] = useState(0);

    const [text, setText] = useState('');
    const [oldText, setOldText] = useState('');
    const [currentSpaceId, setCurrentSpaceId] = useState(0);

    const [editForm] = Form.useForm();

    useEffect(() => {
        EventUtil.Subscribe("editMarkdown", editMarkdown);
        EventUtil.Subscribe("addMarkdown", addMarkdown);
        return () => {
            EventUtil.UnSubscribe("editMarkdown", editMarkdown);
            EventUtil.UnSubscribe("addMarkdown", addMarkdown);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 
    async function editMarkdown(params: any) {
        let [fileId, spaceId] = params;
        setDocId(fileId);
        await signalRUtil.stateConnection.invoke("BeginEdit", fileId);
        try {
            await initFolderData(spaceId);
            let response = await DocRequests.getDoc({
                id: fileId,
                historyId: null
            });
            editForm.setFieldsValue({
                docId: response.data.data.id,
                upFolderId: response.data.data.folderId,
                title: response.data.data.title
            });
            setText(response.data.data.content);
            setOldText(response.data.data.content);
            setEditVisible(true);
        }
        catch (e) {
            console.error(e);
        }
    }

    // 输入内容变化
    function codeTextChange(newText: any, event: any) {
        setOldText(newText);
    }

    // 创建markdown
    async function addMarkdown(params: any) {
        let [spaceId] = params;
        setCurrentSpaceId(spaceId);
        await initFolderData(spaceId);
        editForm.resetFields();
        setText('');
        setOldText('');
        setEditVisible(true);
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
                    spaceId: currentSpaceId,
                    folderId: upFolderId,
                    docType: 3,
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
            <Modal visible={editVisible} onCancel={closeModal} width={1600} title={"Markdown编辑"} footer={null} destroyOnClose={true}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '49%' }}>
                                <MonacoEditor
                                    height="50vh"
                                    language="markdown"
                                    theme="light"
                                    defaultValue={text}
                                    onChange={codeTextChange}
                                />
                            </div>
                            <div style={{ height: "50vh", width: '49%', overflow: 'auto' }}>
                                <ReactMarkdown>{oldText}</ReactMarkdown>
                            </div>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>


        </>
    );
}