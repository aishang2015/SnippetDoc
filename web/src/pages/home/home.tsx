import './home.less';

import React from "react";
import { connect } from 'react-redux';
import { Welcome } from '../../components/common/welcome';
import { ContentPart } from '../../components/home/content';
import { RecentPart } from '../../components/home/recent';
import { RecyclePart } from '../../components/home/recycle';

type home = {
    id?: number;
    userName?: string;
    email?: string;
    phoneNumber?: string;
}

export class Home extends React.Component<any, home>{

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        // try {
        //     let response = await getUserInfo();
        //     let data = response.data.data;
        //     this.setState({
        //         id: data.id,
        //         userName: data.userName,
        //         email: data.email,
        //         phoneNumber: data.phoneNumber
        //     });
        // } catch (err) {
        //     return;
        // }
    }

    // 标题内容
    getDisplayCom(classify: number) {
        switch (classify) {
            case 1:
                return (<ContentPart />);
            case 2:
                return (<RecentPart />);
            case 3:
                return (<RecyclePart />);
        }
        return (<>错误的类型</>);
    }

    render() {
        return (
            <div className="screen_container">
                {(this.props.classify === null || this.props.classify === 0) ?
                    <Welcome /> :
                    <>
                        {this.getDisplayCom(this.props.classify)}
                    </>
                }
                {/* <p>登录用户信息</p>
                <p>id:{this.state.id}</p>
                <p>登录名:{this.state.userName}</p>
                <p>邮箱:{this.state.email}</p>
                <p>电话:{this.state.phoneNumber}</p> */}
            </div>
        );
    }
}

export default connect(
    (state: any) => ({
        spaceId: state.ClassifyReducer.spaceId,
        classify: state.ClassifyReducer.classify,
    })
)(Home);