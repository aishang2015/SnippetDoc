import { Layout } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import NavMenu from '../../components/menu/navMenu';
import NavHeader from '../../components/header/navHeader';
import './layout.less';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { onReceiveMessage } from '../../redux/notification/notificationCreator';
import { signalRUtil } from '../../components/common/signalr';
import { onGetEditDocInfo } from '../../redux/editDoc/editDocCreator';

const { Content } = Layout;


class BasicLayout extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            collapsed: false,
            onLogout: () => { }
        }
    }

    async componentDidMount() {
        await signalRUtil.beginBroadcastConnection();
        await signalRUtil.beginStateConnection();
        signalRUtil.broadcastConnection.on("HandleMessage", (message: string) => {
            this.props.receiveMessage(message);
        });
        signalRUtil.stateConnection.on("GetEditingDic", (message: any) => {
            this.props.getEditDocInfo(message);
        });
    }

    async componentWillUnmount() {
        signalRUtil.broadcastConnection.off("HandleMessage");
    }

    render = () => (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
            <Layout>
                <NavHeader />
                <Content className="layout-content">
                    <div className="left-part">
                        <NavMenu />
                    </div>
                    <div className="right-part">
                        {this.props.children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

// 通过withRouter能把一些路由信息放入到当前页面的props内
export default connect(
    (state: any) => ({
        notifications: state.NotificationReducer.notifications
    }),
    (dispatch: Dispatch) => ({
        receiveMessage: (msg: string) => dispatch(onReceiveMessage(msg)),
        getEditDocInfo: (msg: any) => dispatch(onGetEditDocInfo(msg)),
    })
)(withRouter(BasicLayout));