import './richTextEditor.less';
import { Editor } from '@tinymce/tinymce-react';
import { Configuration } from '../../../common/config';
import { Button, Input, message, Modal, TreeSelect } from 'antd';
import { FileTextOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { createRef, useState } from 'react';
import { FolderRequests } from '../../../http/requests/folder';
import { TreeUtil } from '../../../common/tree-util';
import { DocRequests } from '../../../http/requests/doc';


export function RichTextEditor(props: any) {

    const [editVisible, setEditVisible] = useState(false);
    const [treeData, setTreeData] = useState(new Array<any>());

    // 数据内容
    const [title, setTtile] = useState('');

    const [upFolderId, setUpFolderId] = useState();

    let initialValue = '';
    let editingValue = '';

    function handleEditorChange(content: any, editor: any) {
        editingValue = content;
    }

    // 初始化文件夹树
    async function initFolderData() {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: props.spaceId });
            setTreeData(TreeUtil.MakeAntTreeData(response.data.data, null));
        } catch (e) {
            console.error(e);
        }
    }

    // 添加富文本文档
    async function addFile() {
        await initFolderData();
        setEditVisible(true);
    }

    // 修改富文本文档
    async function modifyFile() {

        try {
            await initFolderData();
            let response = await DocRequests.getDoc({
                id: props.fileId,
                historyId: null
            });
            setEditVisible(true);

            setTtile(response.data.data.name);
            initialValue = response.data.data.content;
            setUpFolderId(response.data.data.folderId as any);
        }
        catch (e) {
            console.error(e);
        }
    }

    // 保存内容
    async function saveFile() {
        if (title === null || title === undefined || title === '') {
            message.error("请输入标题");
            return;
        }
        try {
            await DocRequests.createDoc({
                spaceId: props.spaceId,
                folderId: Number(upFolderId),
                name: title,
                content: editingValue
            });
            setEditVisible(false);
        }
        catch (e) {
            console.error(e);
        }

    }

    // 关闭模态框
    function closeModal() {
        setEditVisible(false);
    }

    // 选择文件夹树
    function selectDocTree(selectedKeys: any, info: any) {
        setUpFolderId(selectedKeys);
    }

    return (
        <>
            {props.fileId === undefined ?
                <div className="file-type-item" onClick={addFile}>
                    <FileTextOutlined style={{ fontSize: '60px' }} />
                    <span>富文本文档</span>
                </div>
                :
                <a key={"list-loadmore-edit"} onClick={modifyFile}><EditOutlined /></a>
            }
            <Modal visible={editVisible} onCancel={closeModal} width={1300} title={"富文本编辑"} footer={null} destroyOnClose={true}
                maskClosable={false}>
                <Button style={{ marginBottom: '10px' }} icon={<SaveOutlined />} onClick={saveFile}>保存</Button>
                <TreeSelect style={{ marginBottom: '10px', width: '100%' }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} allowClear
                    placeholder="请选择保存文件夹" treeData={treeData} value={upFolderId} onSelect={selectDocTree}>
                </TreeSelect>
                <Input style={{ marginBottom: '10px' }} placeholder="请输入标题" maxLength={50} value={title} onChange={(e: any) => setTtile(e.currentTarget.value)}></Input>
                <Editor value={initialValue}
                    init={{
                        language: 'zh_CN',
                        height: 700,
                        menubar: false,
                        plugins: 'print preview paste importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample code | ltr rtl | ',
                        images_upload_url: `${Configuration.BaseUrl}/api/file/uploadFile`,
                        images_upload_base_path: `${Configuration.BaseUrl}/files`
                    }}
                    onEditorChange={handleEditorChange}
                />
            </Modal>
        </>
    );
}