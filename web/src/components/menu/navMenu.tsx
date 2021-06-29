import {
    SettingOutlined, PlusOutlined, FileTextOutlined, FieldTimeOutlined, DeleteOutlined,
    FrownFilled
} from '@ant-design/icons';
import React from "react";
import { Button, Divider, Modal, Select, Tree } from "antd";
import { connect } from "react-redux";
import './navMenu.less';
import { FileTypePanel } from '../panel/filteTypePanel';
import { RichTextEditor } from '../editors/richTextEditor/richTextEditor';
import { GetUserSpaceListResult, SpaceRequests } from '../../http/requests/space';

interface INavMenuProps {
    collapsed: boolean;
}

interface INavMenuState {
    menuIndex: number;
    isFileTypeModalVisible: boolean;
    richTextModalVisible: boolean;

    spaceList: GetUserSpaceListResult[];
    selectedSpace: number;
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
            menuIndex: 1,
            isFileTypeModalVisible: false,
            richTextModalVisible: false,
            spaceList: new Array<GetUserSpaceListResult>(),
            selectedSpace: 0
        }
    }

    async componentDidMount() {
        try {
            var userSpace = await SpaceRequests.getUserSpaceList();
            this.setState({
                spaceList: userSpace.data.data,
                selectedSpace: userSpace.data.data[0].id
            });
        } catch (e) {
            console.error(e);
        }
    }

    render = () => (
        <>
            <div style={{
                textAlign: "center", padding: '10px', height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
                borderTop: '1px solid #eeeeff'
            }}><div>
                    <Select value={this.state.selectedSpace} style={{ width: 170 }} bordered={false} size="small"
                        onChange={value => this.setState({ selectedSpace: value })}>
                        {this.state.spaceList.map(s => (
                            <Select.Option value={s.id}>{s.name}</Select.Option>
                        ))}
                    </Select>
                    <Button type="text" shape="circle" icon={<SettingOutlined />} />
                </div>
                <Divider />
                <Button block icon={<PlusOutlined />} onClick={() => this.openFileTypeModalVisible()}>
                    创建
                </Button>
                <ul className='menu-list' style={{ flex: 1, overflow: 'auto' }}>
                    <li className={this.state.menuIndex === 1 ? 'menu-item menu-active' : 'menu-item'} onClick={()=>this.setMenuIndex(1)}>
                        <FileTextOutlined /> &nbsp; &nbsp;内容
                    </li>
                    <div className="doc-tree">
                        <Tree.DirectoryTree
                            showIcon
                            blockNode={true}
                            defaultExpandAll={false}
                            treeData={this.treeData}
                        />
                    </div>
                </ul>
                <Divider />
                <ul className='menu-list' style={{ flex: 0 }}>
                    <li className={this.state.menuIndex === 2 ? 'menu-item menu-active' : 'menu-item'} onClick={()=>this.setMenuIndex(2)}>
                        <FieldTimeOutlined /> &nbsp; &nbsp;最近
                    </li>
                    <li className={this.state.menuIndex === 3 ? 'menu-item menu-active' : 'menu-item'} onClick={()=>this.setMenuIndex(3)}>
                        <DeleteOutlined /> &nbsp; &nbsp;回收站
                    </li>
                </ul>
                <Modal footer={null} title="请选择" visible={this.state.isFileTypeModalVisible} width={840}
                    onCancel={() => this.closeFileTypeModal()}>
                    <FileTypePanel onSelected={this.selectFileType.bind(this)} />
                </Modal>
                <Modal footer={null} title="富文本编辑器" visible={this.state.richTextModalVisible} width={1280}
                    onCancel={() => this.closeRichTextModal()} destroyOnClose={true}>
                    <RichTextEditor />
                </Modal>
            </div>
        </>
    );

    // 大菜单选择
    setMenuIndex(index: number) {
        this.setState({ menuIndex: index });
    }

    // 选择创建内容类型
    openFileTypeModalVisible() {
        this.setState({
            isFileTypeModalVisible: true
        });
    }

    // 选择了文件类型
    selectFileType(type: number) {
        this.closeFileTypeModal();
        this.setState({
            richTextModalVisible: true
        });
    }

    // 关闭文件类型模态框
    closeFileTypeModal() {
        this.setState({
            isFileTypeModalVisible: false
        });
    }

    closeRichTextModal() {
        this.setState({
            richTextModalVisible: false
        });
    }
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed
    })
)(NavMenu);