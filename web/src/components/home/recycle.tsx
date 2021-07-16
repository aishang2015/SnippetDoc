import { List, Modal, Pagination } from "antd";
import { useEffect, useState } from "react";
import { FileTextOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { RecycleRequests } from "../../http/requests/recycle";
import { dateFormat } from "../../common/time";



export function RecyclePart() {

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [docList, setDocList] = useState(new Array<any>());
    const size = 10;


    useEffect(() => {
        getDocListAsync(page);
    }, [page]);


    // 取得文档列表
    async function getDocListAsync(page: number) {
        try {
            let response = await RecycleRequests.getDeletedDocs({ page: page, size: size });
            setTotal(response.data.data.total);
            setDocList(response.data.data.pagedData);
        } catch (e) {
            console.error(e);
        }
    }

    // 翻页
    async function pageChanged(page: number) {
        setPage(page);
    }

    // 撤销删除文档
    async function revertDoc(id: number) {
        Modal.confirm({
            title: "请确认",
            content: "是否恢复此文档?",
            onOk: async () => {
                try {
                    await RecycleRequests.revertDeleteDoc({ id: id });
                    getDocListAsync(page);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    // 彻底删除文档
    async function deleteDoc(id: number) {
        Modal.confirm({
            title: "请确认",
            content: "彻底删除后，此文档以及历史记录都会被清除并且无法恢复，是否继续?",
            onOk: async () => {
                try {
                    await RecycleRequests.physicsDeleteDoc({ id: id });
                    getDocListAsync(page);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    return (
        <>
            <div className="part-container">
                <div className='big-title'>回收站</div>

                <List dataSource={docList}
                    renderItem={item => {
                        return (
                            <List.Item actions={[
                                <a key={"list-delete"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={() => revertDoc(item.id)}><RollbackOutlined /></a>,
                                <a key={"list-delete"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={() => deleteDoc(item.id)}><DeleteOutlined /></a>
                            ]}>
                                <List.Item.Meta
                                    title={
                                        <>
                                            <span>{item.title}</span>
                                            <span style={{ color: "grey" }}>({item.spaceName})</span>
                                        </>
                                    }
                                    description={item.createBy + "   " + dateFormat(item.createAt)}
                                    avatar={<FileTextOutlined style={{ fontSize: '40px' }} />}>
                                </List.Item.Meta>
                            </List.Item>
                        )
                    }}>
                </List>
                {total !== 0 &&
                    <Pagination current={page} pageSize={size} total={total} showSizeChanger={false} onChange={pageChanged}></Pagination>
                }
            </div>
        </>
    );
}