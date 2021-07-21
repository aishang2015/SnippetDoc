import { Modal, Pagination } from "antd";
import { useEffect, useState } from "react";
import { EventUtil } from "../../common/event";
import { dateFormat } from "../../common/time";
import { DocRequests } from "../../http/requests/doc";


export function HistoryViewer() {

    const [visible, setVisible] = useState(false);
    const [historyList, setHistoryList] = useState(new Array<any>());
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [docId, setDocId] = useState(0);
    const [docType, setDocType] = useState(0);
    const size = 15;

    useEffect(() => {
        EventUtil.Subscribe("viewHistory", init);
        return () => {
            EventUtil.UnSubscribe("viewHistory", init);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 保存文档id
    async function init(params: any) {
        const [docId, docType] = params;
        setDocId(docId);
        setDocType(docType);
        await initHistoryList(docId);
    }

    // 初始化历史列表
    async function initHistoryList(docId: number, page: number = 1) {
        try {
            let response = await DocRequests.getDocHistories({ page: page, size: size, docId: docId });
            setTotal(response.data.data.total);
            setHistoryList(response.data.data.pagedData);
            setVisible(true);
        } catch (e) {
            console.error(e);
        }
    }

    // 浏览详情
    async function viewDetail(historyId: number) {
        if (docType === 1) {
            EventUtil.Emit("viewRichDoc", [docId, historyId]);
        } else if (docType === 2) {
            EventUtil.Emit("viewCodeDoc", [docId, historyId]);
        } else if (docType === 3) {
            EventUtil.Emit("viewMarkdownDoc", [docId, historyId]);
        }
        closeModal();
    }

    // 关闭模态框
    async function closeModal() {
        setVisible(false);
    }

    // 页面变化
    async function pageChange(page: number) {
        setPage(page);
        await initHistoryList(docId, page);
    }

    return (
        <>
            <Modal visible={visible} width={600} footer={null} onCancel={closeModal}
                title="历史记录">
                <div>
                    {
                        historyList.map(history => {
                            return (
                                <div style={{
                                    borderBottom: "1px solid #eeeeee", padding: "10px", marginBottom: '5px',
                                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between'
                                }} onClick={() => viewDetail(history.id)}>
                                    <span style={{ fontWeight: 'bold' }}>{dateFormat(history.operateAt)}</span>
                                    <span>{history.operateBy}</span>
                                </div>);
                        })
                    }
                    <Pagination style={{ marginTop: '10px' }} current={page} pageSize={size} onChange={pageChange}
                        showSizeChanger={false} total={total} />
                </div>
            </Modal>
        </>
    );
}