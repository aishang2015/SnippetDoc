import { Modal } from "antd";
import { useEffect, useState } from "react";
import { EventUtil } from "../../common/event";


export function HistoryViewer() {

    const [visible, setVisible] = useState(false);
    const [historyList, setHistoryList] = useState(new Array<any>());

    useEffect(() => {
        EventUtil.Subscribe("viewHistory", initHistory);
        return () => {
            EventUtil.UnSubscribe("viewHistory", initHistory);
        };
    }, []);

    function initHistory() {
    }

    return (
        <>
            <Modal visible={visible} width={1300} footer={null}>
                <div>
                    {
                        historyList.map(history => {
                            return <div></div>;
                        })
                    }
                </div>
            </Modal>
        </>
    );
}