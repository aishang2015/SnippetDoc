import { Avatar, Button, List, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

import './common.less';
import { useEffect, useState } from "react";
import { FolderRequests } from "../../http/requests/folder";
import { EventUtil } from "../../common/event";
import { DocRequests } from "../../http/requests/doc";

export function ContentPart(props: any) {

    const [docList, setDocList] = useState(new Array<any>());

    const selector = useSelector((state: any) => {
        return state.ClassifyReducer;
    });

    useEffect(() => {
        initDocList();
    }, [selector.spaceId, selector.fileType, selector.fileId]);

    async function initDocList() {
        try {
            let response = await DocRequests.getDocs({
                spaceId: selector.spaceId,
                folderId: selector.fileId
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
                    await FolderRequests.deleteFolder({ spaceId: selector.spaceId, folderId: selector.fileId });
                    EventUtil.EventEmitterInstance().emit('folderDelete', true);
                } catch (e) {
                    console.error(e);
                }
            }
        })
    }

    function modifyFile(fileId: any, spaceId: any) {
        EventUtil.Emit("editRichDoc", [fileId, spaceId]);
    }
    function modifyFolder(folderId: any, spaceId: any) {
        EventUtil.Emit("editFolder", [folderId, spaceId]);
    }

    return (
        <>
            <div className="part-container">
                <div className='big-title'>内容</div>
                {selector.fileType === 1 &&
                    <>
                        <div className='small-title'>文件夹信息</div>
                        <span>文件夹名：gafe</span> &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>创建日期：2012/12/22 12:12:12</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>创建人：<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></span>&nbsp;&nbsp;&nbsp;&nbsp;

                        <div className='small-title'>文件夹操作</div>
                        <div>
                            <Button style={{ marginRight: '10px' }} icon={<EditOutlined />}
                                onClick={() => modifyFolder(selector.fileId, selector.spaceId)}>修改</Button>
                            <Button style={{ marginRight: '10px' }} icon={<DeleteOutlined />} onClick={deleteFolder}>删除</Button>
                        </div>

                        <div className='small-title'>文档列表</div>

                        <List dataSource={docList}
                            renderItem={item => {
                                return (
                                    <List.Item actions={[
                                        <a key={"list-loadmore-edit"} onClick={() => modifyFile(item.id, selector.spaceId)}><EditOutlined /></a>,
                                        <a key={"list-loadmore-delete"}><DeleteOutlined /></a>

                                    ]}>
                                        <List.Item.Meta
                                            title="1111111111111111111112222222222222233333333333333"
                                            description="1231"
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}>
                                        </List.Item.Meta>
                                    </List.Item>
                                )
                            }}>
                        </List>
                    </>
                }
            </div>
        </>
    );
}