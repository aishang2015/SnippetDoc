import Modal from "antd/lib/modal/Modal";
import { useEffect, useState } from "react";
import { EventUtil } from "../../common/event";
import { dateFormat } from "../../common/time";
import { DocRequests } from "../../http/requests/doc";


export function RichViewer() {

    const [visible, setVisible] = useState(false);

    // 文章内容
    const [docInfo, setDocInfo] = useState({} as any);

    useEffect(() => {
        EventUtil.Subscribe("viewRichDoc", viewRichDoc);
        return () => {
            EventUtil.UnSubscribe("viewRichDoc", viewRichDoc);
        };
    }, []);

    // 浏览文档内容
    async function viewRichDoc(params: any) {
        let [docId] = params;
        try {
            let response = await DocRequests.getDoc({
                id: docId,
                historyId: null
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

    return (
        <>
            <Modal visible={visible} width={1000} onCancel={closeView} footer={null}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{docInfo.title}</div>
                <div style={{ color: "gray", margin: '10px 0' }}>

                    <span style={{ marginRight: "10px" }}>作者：{docInfo.createBy}</span>
                    <span style={{ marginRight: "10px" }}>{dateFormat(docInfo.createAt)}</span>
                    {docInfo.updateBy !== null &&
                        <>
                            <span style={{ marginRight: "10px" }}>最后修改：{docInfo.updateBy}</span>
                            <span style={{ marginRight: "10px" }}>{dateFormat(docInfo.updateAt)}</span>
                        </>
                    }
                </div>
                <div dangerouslySetInnerHTML={{ __html: docInfo.content }}></div>
            </Modal>
        </>
    );
}