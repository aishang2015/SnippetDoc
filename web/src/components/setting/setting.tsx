import { Tabs } from "antd";
import React from "react";
import { SpaceSetting } from "./space-setting";
import { UserSetting } from "./user-setting";

interface ISettingProps {
}

export class Setting extends React.Component<ISettingProps>{

    tabInfos = [
        { name: '公用空间管理', key: 1, content: (<SpaceSetting />) },
        { name: '用户管理', key: 2, content: (<UserSetting/>) },
        { name: '信息', key: 3, content: (<div>3</div>) }
    ];

    render = () => {
        return (
            <div style={{ height: "500px" }}>
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: '100%' }}>
                    {
                        this.tabInfos.map(tabInfo => (
                            <Tabs.TabPane tab={tabInfo.name} key={tabInfo.key} style={{ height: '500px', overflow: 'auto' }}>
                                {tabInfo.content}
                            </Tabs.TabPane>
                        ))
                    }
                </Tabs>
            </div>
        );
    }
}