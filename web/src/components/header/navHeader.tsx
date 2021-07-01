import { Avatar, Badge, Button, Dropdown, List, Menu, Modal } from "antd";
import { Header } from "antd/lib/layout/layout";
import React from "react";
import { connect } from "react-redux";
import {
    SettingOutlined,
    DownOutlined,
    NotificationOutlined
} from '@ant-design/icons';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { onToggle } from "../../redux/navCollapsed/navCollapsedCreator";
import { onClearMessage } from "../../redux/notification/notificationCreator";
import { StorageService } from "../../common/storage";
import { Setting } from "../setting/setting";
import { UserSetting } from "./userSetting";
import { PwdSetting } from "./pwdSetting";

type INavHeaderProps = {
    collapsed: boolean;
    toggle: () => {};
    clearMessage: () => {};
    notifications: string[];
} & RouteComponentProps<{}>

type INavHeaderState = {
    visible: boolean;
    isModalVisible: boolean;
    isUserEditVisible: boolean;
    isPwdEditVisible: boolean;
}


class NavHeader extends React.Component<INavHeaderProps, INavHeaderState>{

    state = {
        visible: false,
        isModalVisible: false,
        isUserEditVisible: false,
        isPwdEditVisible: false
    };

    render = () => {
        const menu = (
            <Menu>
                <Menu.Item danger><a onClick={() => this.showUserEditModal()}>头像信息</a></Menu.Item>
                <Menu.Item danger><a onClick={() => this.showPwdEditModal()}>修改密码</a></Menu.Item>
                <Menu.Item danger><a onClick={() => this.logout()}>注销</a></Menu.Item>
            </Menu>
        );


        const message = (
            <div>
                {this.props.notifications.length > 0 &&
                    <Button onClick={() => this.props.clearMessage()}>清理</Button>
                }
                <List
                    itemLayout="horizontal"
                    pagination={{ position: 'bottom' }}
                    dataSource={this.props.notifications}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );

        const userName = StorageService.getUserName();
        const avatarColor = StorageService.getAvatarColor();
        const avatarText = StorageService.getAvatarText();
        return (
            <Header style={{
                padding: 0,
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "white"
            }}>
                <div className="logo" >SnippetDoc</div>
                <div>
                    <Badge count={this.props.notifications.length}>
                        <Dropdown overlay={message} placement="bottomRight" visible={this.state?.visible}
                            onVisibleChange={(flag) => { this.setState({ visible: flag }) }}
                            overlayStyle={{
                                width: 500,
                                background: "white",
                                border: "1px solid gray",
                                padding: 10
                            }}>
                            <Button style={{ verticalAlign: 'middle' }} shape="circle" icon={<NotificationOutlined />} />
                        </Dropdown>
                    </Badge>
                    <Button style={{ marginLeft: "20px", verticalAlign: 'middle' }} shape="circle" icon={<SettingOutlined />}
                        onClick={() => this.showSetting()} />
                    <Dropdown className="dropdown" overlay={menu} trigger={['click']} arrow={false}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ display: 'inline-block' }}>
                            <Avatar style={{ color: 'white', backgroundColor: avatarColor!, marginRight: '5px' }}>
                                {avatarText}
                            </Avatar>
                            <span>{userName}</span>
                            <DownOutlined />
                        </a>
                    </Dropdown>
                </div>

                <Modal title="系统设定" visible={this.state.isModalVisible} width='1000px'
                    footer={null} onCancel={() => this.hideSetting()} destroyOnClose={true}>
                    <Setting></Setting>
                </Modal>

                <Modal title="头像信息" visible={this.state.isUserEditVisible} width='800px'
                    footer={null} onCancel={() => this.closeUserEditModal()} destroyOnClose={true}>
                    <UserSetting onSubmit={() => this.closeUserEditModal()}></UserSetting>
                </Modal>

                <Modal title="修改密码" visible={this.state.isPwdEditVisible} width='600px'
                    footer={null} onCancel={() => this.closePwdEditModal()} destroyOnClose={true}>
                    <PwdSetting onSubmit={() => this.closePwdEditModal()}></PwdSetting>
                </Modal>
            </Header>
        );
    }

    showSetting() {
        this.setState({ isModalVisible: true });
    }

    hideSetting() {
        this.setState({ isModalVisible: false });
    }

    logout() {
        StorageService.clearLoginStore();
        this.props.history.push("/login");
    };

    showUserEditModal() {
        this.setState({ isUserEditVisible: true });
    }

    closeUserEditModal() {
        this.setState({ isUserEditVisible: false });
    }

    showPwdEditModal() {
        this.setState({ isPwdEditVisible: true });
    }

    closePwdEditModal() {
        this.setState({ isPwdEditVisible: false });
    }
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed,
        notifications: state.NotificationReducer.notifications
    }),
    (dispatch: Dispatch) => ({
        toggle: () => dispatch(onToggle()),
        clearMessage: () => dispatch(onClearMessage()),
    })
)(withRouter(NavHeader));