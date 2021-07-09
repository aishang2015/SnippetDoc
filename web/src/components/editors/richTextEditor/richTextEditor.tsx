import './richTextEditor.less';
import { Editor } from '@tinymce/tinymce-react';
import { Configuration } from '../../../common/config';
import { Button, Input, message, Modal, Select, TreeSelect } from 'antd';
import { FileTextOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { FolderRequests } from '../../../http/requests/folder';
import { TreeUtil } from '../../../common/tree-util';


export function RichTextEditor(props: any) {

    const [editVisible, setEditVisible] = useState(false);
    const [treeData, setTreeData] = useState(new Array<any>());

    // 数据内容
    const [title, setTtile] = useState('');

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
    function modifyFile() {

    }

    // 保存内容
    function saveFile() {

    }

    // 关闭模态框
    function closeModal() {
        setEditVisible(false);
    }

    return (
        <>
            {props.fileId === undefined ?
                <div className="file-type-item" onClick={addFile}>
                    <FileTextOutlined style={{ fontSize: '60px' }} />
                    <span>富文本文档</span>
                </div>
                :
                <Button style={{ marginRight: '10px' }} icon={<EditOutlined />} onClick={modifyFile}>修改</Button>
            }
            <Modal visible={editVisible} onCancel={closeModal} width={1300} title={"富文本编辑"} footer={null} destroyOnClose={true}
                maskClosable={false}>
                <Button style={{ marginBottom: '10px' }} icon={<SaveOutlined />} onClick={saveFile}>保存</Button>
                <TreeSelect style={{ marginBottom: '10px', width: '100%' }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} allowClear
                    placeholder="请选择保存文件夹" treeData={treeData}>
                </TreeSelect>
                <Input style={{ marginBottom: '10px' }} placeholder="请输入标题" maxLength={50} value={title} onChange={(e:any) => setTtile(e.value)}></Input>
                <Editor value={initialValue}
                    init={{
                        language: 'zh_CN',
                        height: 700,
                        menubar: false,
                        plugins: 'print preview paste importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample code | ltr rtl | ',
                        images_upload_url: `${Configuration.BaseUrl}/api/file/uploadFile`,
                        images_upload_base_path: `${Configuration.BaseUrl}/files`,

                        // 添加文件上传
                        file_picker_callback: function (callback, value, meta) {

                            // 文件分类
                            var filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4';

                            // 后端接收上传文件的地址
                            var upurl = `${Configuration.BaseUrl}/upload`;

                            // 为不同插件指定文件类型及后端地址
                            switch (meta.filetype) {
                                case 'image':
                                    filetype = '.jpg, .jpeg, .png, .gif';
                                    //upurl = 'upimg.php';
                                    break;
                                case 'media':
                                    filetype = '.mp3, .mp4';
                                    //upurl = 'upfile.php';
                                    break;
                                case 'file':
                                default:
                            }

                            // 模拟出一个input用于添加本地文件
                            let input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', filetype);
                            input.click();
                            input.onchange = function () {
                                let file = input.files![0];

                                let xhr: any;
                                let formData;
                                console.log(file.name);
                                xhr = new XMLHttpRequest();
                                xhr.withCredentials = false;
                                xhr.open('POST', upurl);
                                xhr.onload = function () {
                                    var json;
                                    if (xhr.status !== 200) {
                                        message.error('HTTP Error: ' + xhr.status);
                                        return;
                                    }
                                    json = JSON.parse(xhr.responseText);
                                    if (!json || typeof json.location !== 'string') {
                                        message.error('Invalid JSON: ' + xhr.responseText);
                                        return;
                                    }
                                    callback(`${Configuration.BaseUrl}/file${json.location}`, { text: file.name });
                                };
                                formData = new FormData();
                                formData.append('file', file, `${file.name}`);
                                xhr.send(formData);
                            }
                        }
                    }}
                    onEditorChange={handleEditorChange}
                />
            </Modal>
        </>
    );
}