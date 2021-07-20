import { SettingFilled } from '@ant-design/icons';

export function EditingState(props: any) {

    return (
        <>
            <span style={{ color: "gray" }}>
                <SettingFilled spin />{props.userName}正在修改该文档
            </span>
        </>
    );
}