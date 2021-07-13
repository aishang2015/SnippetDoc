import './richTextEditor.less';
import { Editor } from '@tinymce/tinymce-react';
import { Configuration } from '../../../common/config';
import { Button, Form, Input, Modal, TreeSelect } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FolderRequests } from '../../../http/requests/folder';
import { TreeUtil } from '../../../common/tree-util';
import { DocRequests } from '../../../http/requests/doc';
import { EventUtil } from '../../../common/event';


export function RichTextEditor() {

    const [editVisible, setEditVisible] = useState(false);
    const [treeData, setTreeData] = useState(new Array<any>());

    const [text, setText] = useState('');
    const [currentSpaceId, setCurrentSpaceId] = useState(0);

    const [editForm] = Form.useForm();

    const tinymceConfig = {
        language: 'zh_CN',
        height: 700,
        menubar: false,
        plugins: 'print preview paste importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample code | ltr rtl | ',
        images_upload_url: `${Configuration.BaseUrl}/api/file/uploadFile`,
        images_upload_base_path: `${Configuration.BaseUrl}/files`
    }


    useEffect(() => {
        EventUtil.Subscribe("editRichDoc", modifyFile);
        EventUtil.Subscribe("addRichDoc", addFile);
        return () => {
            EventUtil.UnSubscribe("editRichDoc", modifyFile);
            EventUtil.UnSubscribe("addRichDoc", addFile);
        };
    }, []);

    // 初始化文件夹树
    async function initFolderData(spaceId: any) {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: spaceId });
            setTreeData(TreeUtil.MakeAntTreeData(response.data.data, null));
        } catch (e) {
            console.error(e);
        }
    }

    // 添加富文本文档
    async function addFile(params: any) {
        let [spaceId] = params;
        setCurrentSpaceId(spaceId);
        await initFolderData(spaceId);
        editForm.resetFields();
        setText('');
        setEditVisible(true);
    }

    // 修改富文本文档
    async function modifyFile(params: any) {
        let [fileId, spaceId] = params;
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
            setEditVisible(true);
        }
        catch (e) {
            console.error(e);
        }
    }

    // 关闭模态框
    function closeModal() {
        setEditVisible(false);
    }

    // 提交表单
    async function submitForm(values: any) {
        let docId = values['docId'];
        let upFolderId = values['upFolderId'];
        let title = values['title'];
        let content = text;
        try {
            if (docId === undefined) {

                // 添加新文档
                await DocRequests.createDoc({
                    spaceId: currentSpaceId,
                    folderId: upFolderId,
                    title: title,
                    content: content
                });
            } else {

                // 更新文档
                await DocRequests.updateDoc({
                    id: docId,
                    title: title,
                    content: content
                });

            }
            setEditVisible(false);
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Modal visible={editVisible} onCancel={closeModal} width={1300} title={"富文本文档编辑"} footer={null} destroyOnClose={true}
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
                    <Form.Item name="content" valuePropName="initialValue">
                        <Editor init={tinymceConfig} initialValue={text} value={text}
                            onEditorChange={(newText) => setText(newText)} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}