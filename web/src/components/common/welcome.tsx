import { CarryOutOutlined } from "@ant-design/icons";



export function Welcome() {

    return (
        <>
            <div style={{
                width: '100%', height: '100%', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
            }}>
                <CarryOutOutlined style={{ fontSize: '6em', color: 'lightgray' }} />
                <span style={{ fontSize: '3em', color: 'lightgray' }}>欢迎使用</span>
            </div>
        </>
    );
}