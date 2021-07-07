import { Avatar, Button, List } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

import './common.less';
import { useEffect, useState } from "react";

export function ContentPart(props: any) {

    const [docList, setDocList] = useState(new Array<any>());

    const selector = useSelector((state: any) => {
        return state.TargetFileReducer;
    });

    useEffect(() => {
        if (selector.fileId === null) {
            setDocList([]);
        } else {
            setDocList([1, 2, 3, 4, 5]);
        }
    }, [selector.fileId]);

    return (
        <>
            <div className="part-container">
                <div className='big-title'>内容</div>
                {selector.fileType === 1 &&
                    <>
                        <div className='small-title'>操作</div>
                        <div>
                            <Button style={{ marginRight: '10px' }} icon={<EditOutlined />}>修改</Button>
                            <Button style={{ marginRight: '10px' }} icon={<DeleteOutlined />}>删除</Button>
                        </div>


                        <div className='small-title'>文档</div>

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