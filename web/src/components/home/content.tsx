import { Avatar, Button, List, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

import './common.less';
import { useEffect, useState } from "react";
import { EditFolder } from "../editors/folderEditor/editFolder";
import { FolderRequests } from "../../http/requests/folder";
import { EventUtil } from "../../common/event";

export function ContentPart(props: any) {

    const [docList, setDocList] = useState(new Array<any>());

    const selector = useSelector((state: any) => {
        return state.ClassifyReducer;
    });

    useEffect(() => {
        if (selector.fileId === null) {
            setDocList([]);
        } else {
            setDocList([1, 2, 3, 4, 5]);
        }
    }, [selector.spaceId, selector.fileType, selector.fileId]);

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
                            <EditFolder folderId={selector.fileId} spaceId={selector.spaceId}></EditFolder>
                            <Button style={{ marginRight: '10px' }} icon={<DeleteOutlined />} onClick={deleteFolder}>删除</Button>
                        </div>

                        <div className='small-title'>文档列表</div>

                        <List dataSource={docList}
                            renderItem={item => {
                                return (
                                    <List.Item actions={[
                                        <a key={"list-loadmore-edit" + item}><EditOutlined /></a>,
                                        <a key={"list-loadmore-delete" + item}><DeleteOutlined /></a>
                                    ]}>
                                        <List.Item.Meta
                                            title="1111111111111111111112222222222222233333333333333"
                                            description={item}
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