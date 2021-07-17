import { Avatar, Button, List, Modal, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

import './common.less';
import { useEffect, useState } from "react";
import { FolderRequests } from "../../http/requests/folder";
import { EventUtil } from "../../common/event";
import { DocRequests } from "../../http/requests/doc";
import { dateFormat } from "../../common/time";
import { UserDate } from "../common/userDate";

export function ContentPart() {

    const [docList, setDocList] = useState(new Array<any>());

    const selector = useSelector((state: any) => {
        return state.ClassifyReducer;
    });

    useEffect(() => {
        initDocList();
    }, [selector.spaceId, selector.classify, selector.folderId]); // eslint-disable-line react-hooks/exhaustive-deps

    // 取得文件夹中的文件列表
    async function initDocList() {
        try {
            let response = await DocRequests.getDocs({
                spaceId: selector.spaceId,
                folderId: selector.folderId
            });
            setDocList(response.data.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function deleteFolder() {
        Modal.confirm({
            title: '请确认',
            content: '是否删除该文件夹？',
            onOk: async () => {
                try {
                    await FolderRequests.deleteFolder({ spaceId: selector.spaceId, folderId: selector.folderId });
                    EventUtil.EventEmitterInstance().emit('folderDelete', true);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    function modifyFile(e: any, fileId: any, spaceId: any) {
        e.stopPropagation();
        EventUtil.Emit("editRichDoc", [fileId, spaceId]);
    }
    function modifyFolder(folderId: any, spaceId: any) {
        EventUtil.Emit("editFolder", [folderId, spaceId]);
    }
    function viewHistory(e: any, fileId: any) {
        e.stopPropagation();
        EventUtil.Emit("viewHistory", [fileId]);
    }

    // 浏览文档
    async function viewDoc(docType: number, fileId: number) {
        switch (docType) {

            // 浏览富文本
            case 1:
                EventUtil.Emit("viewRichDoc", [fileId]);
        }
    }

    // 删除文档
    function deleteDoc(e: any, fileId: any) {
        e.stopPropagation();
        Modal.confirm({
            title: "是否删除文件？",
            content: "删除后文件会被移入回收站，可以在回收站将其恢复。",
            onOk: async () => {
                try {
                    await DocRequests.deleteDoc({ id: fileId });
                } catch (e) {
                    console.error(e);
                }
                await initDocList();
            }
        });
    }

    return (
        <>
            <div className="part-container">
                <div className='big-title'>内容</div>
                <>
                    {selector.folderId !== null &&
                        <>
                            <div className='small-title'>文件夹操作</div>
                            <div>
                                <Button style={{ marginRight: '10px' }} icon={<EditOutlined />}
                                    onClick={() => modifyFolder(selector.folderId, selector.spaceId)}>修改</Button>
                                <Button style={{ marginRight: '10px' }} icon={<DeleteOutlined />} onClick={deleteFolder}>删除</Button>
                            </div>
                        </>
                    }

                    <div className='small-title'>文档列表</div>

                    <List dataSource={docList} split={true}
                        renderItem={item => {
                            return (
                                <List.Item style={{ cursor: 'pointer' }} onClick={() => viewDoc(item.docType, item.id)} actions={[
                                    <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => viewHistory(e, item.id)}><HistoryOutlined /></a>,
                                    <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => modifyFile(e, item.id, selector.spaceId)}><EditOutlined /></a>,
                                    <a key={"list-delete"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => deleteDoc(e, item.id)}><DeleteOutlined /></a>

                                ]}>
                                    <List.Item.Meta
                                        title={item.title}
                                        description={
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span>作者：</span>
                                                    <UserDate userName={item.createBy} avatarColor={item.creatorAvatarColor}
                                                        avatarText={item.creatorAvatarText} operateAt={item.createAt} />
                                                    {item.updateBy !== null &&
                                                        <>
                                                            <span style={{ marginLeft: '20px' }}>最近更新：</span>
                                                            <UserDate userName={item.updateBy} avatarColor={item.updatePersonAvatarColor}
                                                                avatarText={item.updatePersonAvatarText} operateAt={item.updateAt} />
                                                        </>
                                                    }
                                                </div>
                                            </>}
                                        avatar={<FileTextOutlined style={{ fontSize: '40px' }} />}>
                                    </List.Item.Meta>
                                </List.Item>
                            )
                        }}>
                    </List>
                </>
            </div>
        </>
    );
}