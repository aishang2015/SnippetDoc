import { FolderTwoTone, FileTwoTone } from '@ant-design/icons';

import './filteTypePanel.less';


export function FileTypePanel(props: {
    onSelected?: (type: number) => void
}) {

    function selected(type: number) {
        if (props.onSelected !== undefined) {
            props.onSelected(type);
        }
    }

    return (
        <>
            <div id="grid-container">
                <div className="file-type-item" onClick={() => selected(1)}>
                    <FolderTwoTone style={{ fontSize: '60px' }} />
                    <span>文件夹</span>
                </div>
                <div className="file-type-item" onClick={() => selected(2)}>
                    <FileTwoTone style={{ fontSize: '60px' }} />
                    <span>富文本文档</span>
                </div>
            </div>
        </>
    );
}