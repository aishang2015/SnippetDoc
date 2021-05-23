import { Tabs } from "antd";
import React from "react";

interface ISettingProps {
}

export class Setting extends React.Component<ISettingProps>{

    tabInfos = [
        { name: '空间管理', key: 1, content: (<div>1</div>) },
        { name: '用户管理', key: 2, content: (<div>2</div>) },
        { name: '信息', key: 3, content: (<div>3</div>) }
    ];

    render = () => {
        return (
            <div style={{ height: "500px" }}>
                <Tabs defaultActiveKey="1" tabPosition="left">
                    {
                        this.tabInfos.map(tabInfo => (
                            <Tabs.TabPane tab={tabInfo.name} key={tabInfo.key}>
                                {tabInfo.content}
                            </Tabs.TabPane>
                        ))
                    }
                </Tabs>
            </div>
        );
    }
}