import './richTextEditor.less';
import { Editor } from '@tinymce/tinymce-react';
import { Configuration } from '../../../common/config';
import { message } from 'antd';


export function RichTextEditor() {

    let initialValue = '';
    let editingValue = '';

    function handleEditorChange(content: any, editor: any) {
        editingValue = content;
    }

    return (
        <>
            <Editor value={initialValue}
                init={{
                    language: 'zh_CN',
                    height: 700,
                    menubar: false,
                    plugins: 'print preview paste importcss searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample code | ltr rtl | ',
                    images_upload_url: `${Configuration.BaseUrl}/upload`,
                    images_upload_base_path: `${Configuration.BaseUrl}/file`,
                    // codesample_languages: [
                    //     { text: 'HTML/XML', value: 'markup' },
                    //     { text: 'JavaScript', value: 'javascript' },
                    //     { text: 'CSS', value: 'css' },
                    // ],
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
        </>
    );
}