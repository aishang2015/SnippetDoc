import { Avatar, Tooltip } from "antd";


export function UserGroup(props: any) {


    return (
        <>
            <Avatar.Group>
                {props.group.map((user: any) => {
                    return (
                        <Tooltip title={user.userName}>
                            <Avatar size={18} style={{
                                fontSize: '10px', backgroundColor: user.avatarColor!,
                                marginRight: '10px'
                            }}>
                                {user.avatarText}
                            </Avatar>
                        </Tooltip>
                    );
                })}
            </Avatar.Group>
        </>
    );
}