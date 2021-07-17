import { Avatar, Tooltip } from "antd";
import { dateFormat } from "../../common/time";


export function UserDate(props: any) {


    return (
        <>
            <Tooltip title={props.userName}>
                <Avatar size={18} style={{
                    fontSize: '10px', backgroundColor: props.avatarColor!,
                    marginRight: '10px'
                }}>
                    {props.avatarText}
                </Avatar>
            </Tooltip>
            <span style={{ marginRight: '10px' }}>{dateFormat(props.operateAt)}</span>
        </>
    );

}