import { FileTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { EditFolder } from '../modals/editFolder';

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

    return (
        <>
            <div id="grid-container" onClick={() => selected()}>
                <EditFolder spaceId={selector.spaceId} onClick={() => selected()} />
                <div className="file-type-item" onClick={() => selected()}>
                    <FileTwoTone style={{ fontSize: '60px' }} />
                    <span>富文本文档</span>
                </div>
            </div>
        </>
    );
}