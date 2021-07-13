import {
    SettingOutlined, PlusOutlined, FileTextOutlined, FieldTimeOutlined, DeleteOutlined
} from '@ant-design/icons';
import React, { Key } from "react";
import { Button, Divider, Modal, Select, Tree } from "antd";
import { connect } from "react-redux";
import './navMenu.less';
import { FileTypePanel } from '../panel/filteTypePanel';
import { RichTextEditor } from '../editors/richTextEditor/richTextEditor';
import { GetUserSpaceListResult, SpaceRequests } from '../../http/requests/space';
import { FolderRequests } from '../../http/requests/folder';
import { TreeUtil } from '../../common/tree-util';
import { Dispatch } from 'redux';
import { onClassifyChange } from '../../redux/classify/classifyCreator';
import { EventUtil } from '../../common/event';
import { EditFolder } from '../editors/folderEditor/editFolder';

type INavMenuProps = {
    collapsed: boolean;
} & any

type INavMenuState = {
    menuIndex: number;
    isFileTypeModalVisible: boolean;
    richTextModalVisible: boolean;

    spaceList: GetUserSpaceListResult[];
    selectedSpace: number;

    treeData: any[];

    selectedKeys: any[];
}

class NavMenu extends React.Component<INavMenuProps, INavMenuState>{


    constructor(props: any) {
        super(props);
        this.state = {
            menuIndex: 0,
            isFileTypeModalVisible: false,
            richTextModalVisible: false,
            spaceList: [{ id: 0, name: '我的空间', role: 0 }],
            selectedSpace: 0,
            treeData: [],
            selectedKeys: []
        }
    }

    async componentDidMount() {
        try {
            var userSpace = await SpaceRequests.getUserSpaceList();

            let spaceId = userSpace.data.data[0].id;
            let response = await FolderRequests.getFolderTree({ spaceId: spaceId });
            let treedata = TreeUtil.MakeAntTreeKeyData(response.data.data, null);
            this.setState({
                treeData: treedata,
                spaceList: userSpace.data.data,
                selectedSpace: spaceId
            });

            // 全局同步
            this.props.classifyChange(spaceId, 0, null, null);
        } catch (e) {
            console.error(e);
        }

        let that = this;
        EventUtil.EventEmitterInstance().on('folderChange', function (text: any) {
            that.reloadFolderTree();
        });
        EventUtil.EventEmitterInstance().on('folderDelete', function (text: any) {
            that.reloadFolderTree();
            that.setMenuIndex(0);
        });
    }

    render = () => (
        <>
            <div style={{
                textAlign: "center", padding: '10px', height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
                borderTop: '1px solid #eeeeff'
            }}><div>
                    <Select value={this.state.selectedSpace} style={{ width: 170 }} bordered={false} size="small"
                        onChange={this.selectSpaceChange.bind(this)}>
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
                    <li className={this.state.menuIndex === 1 ? 'menu-item menu-active' : 'menu-item'} onClick={() => this.setMenuIndex(1)}>
                        <FileTextOutlined /> &nbsp; &nbsp;内容
                    </li>
                    <div className="doc-tree">
                        <Tree.DirectoryTree
                            showIcon
                            selectedKeys={this.state.selectedKeys}
                            blockNode={true}
                            expandAction={false}
                            treeData={this.state.treeData}
                            onSelect={this.selectDocTree.bind(this)}
                        />
                    </div>
                </ul>
                <Divider />
                <ul className='menu-list' style={{ flex: 0 }}>
                    <li className={this.state.menuIndex === 2 ? 'menu-item menu-active' : 'menu-item'} onClick={() => this.setMenuIndex(2)}>
                        <FieldTimeOutlined /> &nbsp; &nbsp;最近
                    </li>
                    <li className={this.state.menuIndex === 3 ? 'menu-item menu-active' : 'menu-item'} onClick={() => this.setMenuIndex(3)}>
                        <DeleteOutlined /> &nbsp; &nbsp;回收站
                    </li>
                </ul>
                <Modal footer={null} title="请选择" visible={this.state.isFileTypeModalVisible} width={840}
                    onCancel={() => this.selectTypeEnd()} >
                    <FileTypePanel onSelected={this.selectTypeEnd.bind(this)} />
                </Modal>
                <Modal footer={null} title="富文本编辑器" visible={this.state.richTextModalVisible} width={1280}
                    onCancel={() => this.closeRichTextModal()} destroyOnClose={true}>
                    <RichTextEditor />
                </Modal>
                <RichTextEditor />
                <EditFolder />
            </div>
        </>
    );

    // 大菜单选择
    setMenuIndex(index: number) {
        this.setState({
            menuIndex: index,
            selectedKeys: []
        });

        // 全局同步
        this.props.classifyChange(this.state.selectedSpace, index, null, null);
    }

    // 选择空间变化
    async selectSpaceChange(value: number) {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: value });
            let treedata = TreeUtil.MakeAntTreeKeyData(response.data.data, null);
            this.setState({
                selectedSpace: value,
                treeData: treedata,
                menuIndex: 0,
                selectedKeys: []
            });

            // 全局同步
            this.props.classifyChange(value, 0, null, null);
        }
        catch (e) {
            console.error(e);
        }
    }

    // 选择创建内容类型
    openFileTypeModalVisible() {
        this.setState({
            isFileTypeModalVisible: true
        });
    }

    async selectTypeEnd() {
        this.setState({
            isFileTypeModalVisible: false
        });
    }

    // 关闭文件类型模态框
    async closeFileTypeModal() {
        let response = await FolderRequests.getFolderTree({ spaceId: this.state.selectedSpace });
        let treedata = TreeUtil.MakeAntTreeKeyData(response.data.data, null);
        this.setState({
            treeData: treedata,
            isFileTypeModalVisible: false
        });
    }

    // 重新加载文件夹树
    async reloadFolderTree() {
        let response = await FolderRequests.getFolderTree({ spaceId: this.state.selectedSpace });
        let treedata = TreeUtil.MakeAntTreeKeyData(response.data.data, null);
        this.setState({
            treeData: treedata
        });
    }

    closeRichTextModal() {
        this.setState({
            richTextModalVisible: false
        });
    }

    // 选择文件夹树
    selectDocTree(selectedKeys: Key[], info: any) {
        this.setState({
            menuIndex: 1,
            selectedKeys: selectedKeys
        });

        // 全局同步
        this.props.classifyChange(this.state.selectedSpace, 1, 1, selectedKeys[0]);
    }
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed
    }),
    (dispatch: Dispatch) => ({
        classifyChange: (spaceId: number, classify: number, fileType: number, fileId: number) =>
            dispatch(onClassifyChange(spaceId, classify, fileType, fileId))
    })
)(NavMenu);