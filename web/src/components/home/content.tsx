import { Button, List, Modal } from "antd";
import {
    EditOutlined, DeleteOutlined, FileTextOutlined, HistoryOutlined, CopyOutlined,
    CodeOutlined, FileUnknownOutlined
} from '@ant-design/icons';
import { useSelector } from "react-redux";

import './common.less';
import { useEffect, useState } from "react";
import { FolderRequests } from "../../http/requests/folder";
import { EventUtil } from "../../common/event";
import { DocRequests } from "../../http/requests/doc";
import { UserDate } from "../common/userDate";
import { EditingState } from "../common/editing";

export function ContentPart() {

    const [docList, setDocList] = useState(new Array<any>());

    const classifySelector = useSelector((state: any) => {
        return state.ClassifyReducer;
    });

    const editdocSelector = useSelector((state: any) => {
        return state.EditDocReducer.editDoc;
    });

    useEffect(() => {
        initDocList();
    }, [classifySelector.spaceId, classifySelector.classify, classifySelector.folderId]); // eslint-disable-line react-hooks/exhaustive-deps

    // 取得文件夹中的文件列表
    async function initDocList() {
        try {
            let response = await DocRequests.getDocs({
                spaceId: classifySelector.spaceId,
                folderId: classifySelector.folderId
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
                    await FolderRequests.deleteFolder({ spaceId: classifySelector.spaceId, folderId: classifySelector.folderId });
                    EventUtil.EventEmitterInstance().emit('folderDelete', true);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    function modifyFile(e: any, fileId: any, spaceId: any, docType: any) {
        console.log(docType);
        e.stopPropagation();
        if (docType === 1) {
            EventUtil.Emit("editRichDoc", [fileId, spaceId]);
        } else if (docType === 2) {
            EventUtil.Emit("editCodeDoc", [fileId, spaceId]);
        }
    }
    function modifyFolder(folderId: any, spaceId: any) {
        EventUtil.Emit("editFolder", [folderId, spaceId]);
    }
    function viewHistory(e: any, fileId: any, docType: any) {
        e.stopPropagation();
        EventUtil.Emit("viewHistory", [fileId, docType]);
    }

    // 复制文档
    function copyDoc(e: any, docId: any) {
        e.stopPropagation();
        EventUtil.Emit("copyFile", [docId]);
    }

    // 浏览文档
    async function viewDoc(docType: number, fileId: number) {
        switch (docType) {

            // 浏览富文本
            case 1:
                EventUtil.Emit("viewRichDoc", [fileId]);
                break;

            // 浏览代码
            case 2:
                EventUtil.Emit("viewCodeDoc", [fileId]);
                break;
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

    function docActions(item: any) {
        return editdocSelector[item.id] ?
            [
                <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => copyDoc(e, item.id)}><CopyOutlined /></a>,
                <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => viewHistory(e, item.id, item.docType)}><HistoryOutlined /></a>,
            ] :
            [
                <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => copyDoc(e, item.id)}><CopyOutlined /></a>,
                <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => viewHistory(e, item.id, item.docType)}><HistoryOutlined /></a>,
                <a key={"list-edit"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => modifyFile(e, item.id, classifySelector.spaceId, item.docType)}><EditOutlined /></a>,
                <a key={"list-delete"} style={{ fontSize: '1.1rem', padding: "10px 5px" }} onClick={(e) => deleteDoc(e, item.id)}><DeleteOutlined /></a>
            ];
    }

    function contentIcon(item: any) {
        let result;
        switch (item.docType) {
            case 1:
                result = (<FileTextOutlined style={{ fontSize: '40px' }} />);
                break;
            case 2:
                result = (<CodeOutlined style={{ fontSize: '40px' }} />);
                break;
            default:
                result = (<FileUnknownOutlined style={{ fontSize: '40px' }} />);
                break;
        }
        return result;
    }

    return (
        <>
            <div className="part-container">
                <div className='big-title'>内容</div>
                <>
                    {classifySelector.folderId !== null &&
                        <>
                            <div className='small-title'>文件夹操作</div>
                            <div>
                                <Button style={{ marginRight: '10px' }} icon={<EditOutlined />}
                                    onClick={() => modifyFolder(classifySelector.folderId, classifySelector.spaceId)}>修改</Button>
                                <Button style={{ marginRight: '10px' }} icon={<DeleteOutlined />} onClick={deleteFolder}>删除</Button>
                            </div>
                        </>
                    }

                    <div className='small-title'>文档列表</div>

                    <List dataSource={docList} split={true}
                        renderItem={item => {
                            return (
                                <List.Item style={{ cursor: 'pointer' }} onClick={() => viewDoc(item.docType, item.id)} actions={
                                    docActions(item)
                                }>
                                    <List.Item.Meta
                                        title={
                                            <>
                                                {item.title}
                                                {editdocSelector[item.id] &&
                                                    <EditingState userName={editdocSelector[item.id]} />
                                                }
                                            </>
                                        }
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
                                        avatar={contentIcon(item)}>
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