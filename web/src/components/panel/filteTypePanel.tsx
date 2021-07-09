import { FileTextOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { EditFolder } from '../editors/folderEditor/editFolder';
import { RichTextEditor } from '../editors/richTextEditor/richTextEditor';

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
                <EditFolder spaceId={selector.spaceId} />
                <RichTextEditor spaceId={selector.spaceId} />
            </div>
        </>
    );
}