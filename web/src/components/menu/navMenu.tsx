import Sider from "antd/lib/layout/Sider";
import { SettingOutlined, PlusOutlined } from '@ant-design/icons';
import React from "react";
import { Link } from 'react-router-dom';
import { Button, Divider, Menu, Select } from "antd";
import { connect } from "react-redux";

interface INavMenuProps {
    collapsed: boolean;
}

class NavMenu extends React.Component<INavMenuProps>{
    render = () => (
        <div>
            <div style={{ textAlign: "center", padding: '10px' }}>
                <Select defaultValue="mySpace" style={{ width: 170 }} bordered={false} size="small">
                    <Select.Option value="mySpace">我的空间</Select.Option>
                    <Select.Option value="lucy">Lucy</Select.Option>
                    <Select.Option value="Yiminghe">yiminghe</Select.Option>
                </Select>
                <Button type="text" shape="circle" icon={<SettingOutlined />} />
                <Divider />
                <Button type="primary" block icon={<PlusOutlined />}>
                    新建
                </Button>
            </div>
        </div>
    );
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed
    })
)(NavMenu);