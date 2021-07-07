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
import { EditFolder } from '../modals/editFolder';
import { FolderRequests } from '../../http/requests/folder';
import { TreeUtil } from '../../common/tree-util';
import { Dispatch } from 'redux';
import { onClassifyChange } from '../../redux/classify/classifyCreator';
import { onTargetFileChange } from '../../redux/targetFile/targetFileCreator';

type INavMenuProps = {
    collapsed: boolean;
} & any

type INavMenuState = {
    menuIndex: number;
    isFileTypeModalVisible: boolean;
    richTextModalVisible: boolean;

    spaceList: GetUserSpaceListResult[];
    selectedSpace: number;

    editFolderVisible: boolean;

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
            editFolderVisible: false,
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
                            defaultExpandAll={false}
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
                    onCancel={() => this.closeFileTypeModal()}>
                    <FileTypePanel onSelected={this.selectFileType.bind(this)} />
                </Modal>
                <Modal footer={null} title="富文本编辑器" visible={this.state.richTextModalVisible} width={1280}
                    onCancel={() => this.closeRichTextModal()} destroyOnClose={true}>
                    <RichTextEditor />
                </Modal>
                <EditFolder spaceId={this.state.selectedSpace} visible={this.state.editFolderVisible}
                    onCancel={() => this.closeEditFolder()} />
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
        this.props.classifyChange({ spaceId: this.state.selectedSpace, classify: index });
        this.props.selectFileChange(null, null);
    }

    // 选择空间变化
    async selectSpaceChange(value: number) {
        try {
            let response = await FolderRequests.getFolderTree({ spaceId: value });
            let treedata = TreeUtil.MakeAntTreeKeyData(response.data.data, null);
            this.setState({
                selectedSpace: value,
                treeData: treedata,
                menuIndex: 0
            });

            // 全局同步
            this.props.classifyChange({ spaceId: value, classify: 0 });
            this.props.selectFileChange(null, null);
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

    // 选择了文件类型
    selectFileType(type: number) {
        this.closeFileTypeModal();
        if (type === 1) {
            this.setState({
                editFolderVisible: true
            });
        } else if (type === 2) {
            this.setState({
                richTextModalVisible: true
            });
        }
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

    async closeEditFolder() {
        let response = await FolderRequests.getFolderTree({ spaceId: this.state.selectedSpace });
        let treedata = TreeUtil.MakeAntTreeKeyData(response.data.data, null);
        this.setState({
            treeData: treedata,
            editFolderVisible: false
        });
    }

    // 选择文件夹树
    selectDocTree(selectedKeys: Key[], info: any) {
        this.setState({
            menuIndex: 1,
            selectedKeys: selectedKeys
        });

        // 全局同步
        this.props.classifyChange({ spaceId: this.state.selectedSpace, classify: 1 });
        this.props.selectFileChange(1, selectedKeys[0]);
    }
}

export default connect(
    (state: any) => ({
        collapsed: state.NavCollapsedReducer.collapsed
    }),
    (dispatch: Dispatch) => ({
        classifyChange: (data: { spaceId: number, classify: number }) =>
            dispatch(onClassifyChange(data.spaceId, data.classify)),
        selectFileChange: (fileType: number, fileId: number) =>
            dispatch(onTargetFileChange(fileType, fileId))
    })
)(NavMenu);