import Modal from "antd/lib/modal/Modal";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { EventUtil } from "../../common/event";
import { DocRequests } from "../../http/requests/doc";
import { UserDate } from "../common/userDate";
import { UserGroup } from "../common/userGroup";
import ReactMarkdown from 'react-markdown';
import './richViewer.less';

export function MarkdownViewer() {

    const [visible, setVisible] = useState(false);

    // 文章内容
    const [docInfo, setDocInfo] = useState({} as any);

    useEffect(() => {
        EventUtil.Subscribe("viewMarkdownDoc", viewMarkdownDoc);
        return () => {
            EventUtil.UnSubscribe("viewMarkdownDoc", viewMarkdownDoc);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 浏览文档内容
    async function viewMarkdownDoc(params: any) {
        let [docId, historyId] = params;
        try {
            let response = await DocRequests.getDoc({
                id: docId,
                historyId: historyId
            });
            setDocInfo(response.data.data);
            setVisible(true);
        } catch (e) {
            console.error(e);
        }
    }

    // 关闭模态框
    function closeView() {
        setVisible(false);
    }

    const componentRef: any = useRef();
    // const exportPdf = useReactToPrint({
    //     content: () => componentRef.current,
    // });
    // const exportWord = () => {
    //     ExportUtil.export2Word(componentRef.current.innerHTML, docInfo.title);
    // };

    return (
        <>
            <Modal visible={visible} width={1100} onCancel={closeView} footer={null} bodyStyle={{ padding: 0 }} >
                <div ref={componentRef} style={{ padding: '24px', overflow: 'auto' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{docInfo.title}</div>
                    <div style={{ color: "gray", margin: '10px 0', display: 'flex', alignItems: 'center' }} >

                        <span>作者：</span>
                        <UserDate userName={docInfo.createBy} avatarColor={docInfo.creatorAvatarColor}
                            avatarText={docInfo.creatorAvatarText} operateAt={docInfo.createAt} />
                        {docInfo.updateBy !== null &&
                            <>
                                <span style={{ marginLeft: "20px" }}>最近更新：</span>
                                <UserDate userName={docInfo.updateBy} avatarColor={docInfo.updatePersonAvatarColor}
                                    avatarText={docInfo.updatePersonAvatarText} operateAt={docInfo.updateAt} />
                                <span style={{ marginLeft: "20px" }}>贡献者：</span>
                                <UserGroup group={docInfo.docModifyUsers}></UserGroup>

                            </>
                        }
                        <div style={{ flexGrow: 1 }}></div>
                        {/* <div style={{ marginLeft: '10px', fontSize: '1.1rem' }} onClick={exportWord}><a><FileWordOutlined /></a></div>
                        <div style={{ marginLeft: '10px', fontSize: '1.1rem' }} onClick={exportPdf}><a><FilePdfOutlined /></a></div> */}

                    </div>

                    <ReactMarkdown>{docInfo.content}</ReactMarkdown>
                </div>
            </Modal>
        </>
    );
}