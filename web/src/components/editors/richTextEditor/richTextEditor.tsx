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
import { signalRUtil } from '../../common/signalr';


export function RichTextEditor() {

    const [editVisible, setEditVisible] = useState(false);
    const [treeData, setTreeData] = useState(new Array<any>());
    const [docId, setDocId] = useState(0);

    const [text, setText] = useState('');
    const [oldText, setOldText] = useState('');
    const [currentSpaceId, setCurrentSpaceId] = useState(0);

    const [editForm] = Form.useForm();

    const tinymceConfig = {
        language: 'zh_CN',
        height: 700,
        menubar: false,
        content_style: "img {max-width:100%;}",
        plugins: 'print preview paste importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample code | ltr rtl | ',
        images_upload_url: `${Configuration.BaseUrl}/api/file/uploadFile`,
        images_upload_base_path: `${Configuration.BaseUrl}/files`,
    }


    useEffect(() => {
        EventUtil.Subscribe("editRichDoc", modifyFile);
        EventUtil.Subscribe("addRichDoc", addFile);
        return () => {
            EventUtil.UnSubscribe("editRichDoc", modifyFile);
            EventUtil.UnSubscribe("addRichDoc", addFile);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ?????????????????????
    async function initFolderData(spaceId: any) {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: spaceId });
            setTreeData(TreeUtil.MakeAntTreeData(response.data.data, null));
        } catch (e) {
            console.error(e);
        }
    }

    // ?????????????????????
    async function addFile(params: any) {
        let [spaceId] = params;
        setCurrentSpaceId(spaceId);
        await initFolderData(spaceId);
        editForm.resetFields();
        setText('');
        setEditVisible(true);
    }

    // ?????????????????????
    async function modifyFile(params: any) {
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
            setEditVisible(true);
        }
        catch (e) {
            console.error(e);
        }
    }

    function richTextChange(newText: string) {
        setOldText(newText);
    }

    // ???????????????
    async function closeModal() {
        setEditVisible(false);
        await signalRUtil.stateConnection.invoke("EndEdit", docId);
    }

    // ????????????
    async function submitForm(values: any) {

        let docId = values['docId'];
        let upFolderId = values['upFolderId'];
        let title = values['title'];
        let content = oldText;
        try {
            if (docId === undefined) {

                // ???????????????
                await DocRequests.createDoc({
                    spaceId: currentSpaceId,
                    folderId: upFolderId,
                    docType: 1,
                    title: title,
                    content: content
                });
                setEditVisible(false);
            } else {

                // ????????????
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
            <Modal visible={editVisible} onCancel={closeModal} width={1100} title={"?????????????????????"} footer={null} destroyOnClose={true}
                maskClosable={false}>
                <Form wrapperCol={{ span: 24 }} onFinish={submitForm} form={editForm}>
                    <Form.Item>
                        <Button icon={<SaveOutlined />} htmlType="submit">??????</Button>
                    </Form.Item>
                    <Form.Item hidden name="docId">
                        <Input />
                    </Form.Item>
                    <Form.Item name="upFolderId">
                        <TreeSelect style={{ width: '100%' }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} allowClear
                            placeholder="????????????????????????" treeData={treeData} >
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item name="title" rules={
                        [
                            { required: true, message: '???????????????!' },
                            { max: 100, message: '????????????!' }
                        ]
                    }>
                        <Input placeholder="???????????????" maxLength={100} autoComplete="off"></Input>
                    </Form.Item>
                    <Form.Item name="content">
                        <Editor init={tinymceConfig} initialValue={text} onEditorChange={richTextChange} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}