import { FileTextOutlined, FolderOutlined, CodeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { EventUtil } from '../../../common/event';

import './filteTypePanel.less';


export function FileTypePanel(props: {
    onSelected?: () => void
}) {

    const selector = useSelector((state: any) => {
        return state.ClassifyReducer;
    });


    function selected() {
        if (props.onSelected !== undefined) {
            props.onSelected();
        }
    }

    function addRichTextFile() {
        EventUtil.Emit("addRichDoc", [selector.spaceId]);
    }

    function addNewFolder() {
        EventUtil.Emit("addFolder", [selector.spaceId]);
    }

    function addCode() {
        EventUtil.Emit("addCodeDoc", [selector.spaceId]);
    }

    return (
        <>
            <div id="grid-container" onClick={() => selected()}>
                <div className="file-type-item" onClick={addNewFolder}>
                    <FolderOutlined style={{ fontSize: '60px' }} />
                    <span>文件夹</span>
                </div>
                <div className="file-type-item" onClick={addRichTextFile}>
                    <FileTextOutlined style={{ fontSize: '60px' }} />
                    <span>富文本文档</span>
                </div>
                <div className="file-type-item" onClick={addCode}>
                    <CodeOutlined style={{ fontSize: '60px' }} />
                    <span>代码片段</span>
                </div>
            </div>
        </>
    );
}