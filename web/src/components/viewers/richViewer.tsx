import Modal from "antd/lib/modal/Modal";
import { useEffect, useState } from "react";
import { EventUtil } from "../../common/event";
import { DocRequests } from "../../http/requests/doc";
import { UserDate } from "../common/userDate";
import { UserGroup } from "../common/userGroup";


export function RichViewer() {

    const [visible, setVisible] = useState(false);

    // 文章内容
    const [docInfo, setDocInfo] = useState({} as any);

    useEffect(() => {
        EventUtil.Subscribe("viewRichDoc", viewRichDoc);
        return () => {
            EventUtil.UnSubscribe("viewRichDoc", viewRichDoc);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 浏览文档内容
    async function viewRichDoc(params: any) {
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

    return (
        <>
            <Modal visible={visible} width={1000} onCancel={closeView} footer={null}>
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
                </div>
                <div dangerouslySetInnerHTML={{ __html: docInfo.content }}></div>
            </Modal>
        </>
    );
}