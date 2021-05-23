import { Layout } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import NavMenu from '../../components/menu/navMenu';
import NavHeader from '../../components/header/navHeader';
import { Configuration } from '../../common/config';
import './layout.less';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { onReceiveMessage } from '../../redux/notification/notificationCreator';

const signalR = require("@microsoft/signalr");

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
        let connection = new signalR.HubConnectionBuilder()
            .withUrl(`${Configuration.BaseUrl}/broadcast`, { accessTokenFactory: () => localStorage.getItem("token") })
            .build();

        let startFun = async () => {
            try {
                await connection.start();
            } catch (err) {
                console.log(err);
                setTimeout(startFun, 5000);
            }
        }

        connection.on("HandleMessage", (message: string) => {
            this.props.receiveMessage(message);
        });

        connection.onclose(startFun);

        await startFun();
    }

    render = () => (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
            <Layout>
                <NavHeader />
                <Content className="layout-content">
                    <div className="left-part">
                        <NavMenu/>
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
    })
)(withRouter(BasicLayout));