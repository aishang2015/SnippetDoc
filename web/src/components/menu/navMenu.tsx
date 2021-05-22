import Sider from "antd/lib/layout/Sider";
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import React from "react";
import { Link } from 'react-router-dom';
import { Menu } from "antd";
import { connect } from "react-redux";

interface INavMenuProps {
    collapsed: boolean;
}

class NavMenu extends React.Component<INavMenuProps>{
    render = () => (

        <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
            {this.props.collapsed ?
                <div className="logo" >Snippet</div> :
                <div className="logo large-logo-font" >Snippet</div>
            }
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link to="/home">主页</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    <Link to="/about">关于</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed
    })
)(NavMenu);