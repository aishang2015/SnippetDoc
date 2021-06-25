import {
    SettingOutlined, PlusOutlined, FileTextOutlined, FieldTimeOutlined, DeleteOutlined
} from '@ant-design/icons';
import React from "react";
import { Button, Divider, Menu, Select, Tree } from "antd";
import { connect } from "react-redux";
import './navMenu.less';

interface INavMenuProps {
    collapsed: boolean;
}

interface INavMenuState {
    menuIndex: number;
}

class NavMenu extends React.Component<INavMenuProps, INavMenuState>{

    treeData = [
        {
            title: 'parent 0',
            key: '0-0',
            children: [
                { title: 'leaf 0-0222222222222222222233333333333333333322222', key: '0-0-0', isLeaf: true },
                { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
            ],
        },
        {
            title: 'parent 1',
            key: '0-1',
            children: [
                { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
                { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
            ],
        }
    ];

    constructor(props: any) {
        super(props);
        this.state = {
            menuIndex: 0
        }
    }

    render = () => (
        <>
            <div style={{
                textAlign: "center", padding: '10px', height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'
            }}><div>
                    <Select defaultValue="mySpace" style={{ width: 170 }} bordered={false} size="small">
                        <Select.Option value="mySpace">我的空间</Select.Option>
                        <Select.Option value="lucy">Lucy</Select.Option>
                        <Select.Option value="Yiminghe">yiminghe</Select.Option>
                    </Select>
                    <Button type="text" shape="circle" icon={<SettingOutlined />} />
                </div>
                <Divider />
                <Button block icon={<PlusOutlined />}>
                    创建
                </Button>
                <ul className='menu-list' style={{ flex: 1, overflow: 'auto' }}>
                    <li className={this.state.menuIndex === 1 ? 'menu-item menu-active' : 'menu-item'} onClick={() => this.setState({ menuIndex: 1 })}>
                        <FileTextOutlined /> &nbsp; &nbsp;内容
                    </li>
                    <div className="doc-tree">
                        <Tree
                            blockNode={true}
                            defaultExpandAll={false}
                            treeData={this.treeData}
                        />
                    </div>
                </ul>
                <Divider />
                <ul className='menu-list' style={{ flex: 0 }}>
                    <li className={this.state.menuIndex === 2 ? 'menu-item menu-active' : 'menu-item'} onClick={() => this.setState({ menuIndex: 2 })}>
                        <FieldTimeOutlined /> &nbsp; &nbsp;最近
                    </li>
                    <li className={this.state.menuIndex === 3 ? 'menu-item menu-active' : 'menu-item'} onClick={() => this.setState({ menuIndex: 3 })}>
                        <DeleteOutlined /> &nbsp; &nbsp;回收站
                    </li>
                </ul>
            </div>
        </>
    );
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed
    })
)(NavMenu);