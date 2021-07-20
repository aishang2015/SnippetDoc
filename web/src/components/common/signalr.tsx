import { Configuration } from "../../common/config";

const signalR = require("@microsoft/signalr");

export class signalRUtil {

    static broadcastConnection: any;

    static stateConnection: any;

    // 开启连接
    static async beginBroadcastConnection() {

        signalRUtil.broadcastConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${Configuration.BaseUrl}/broadcast`, { accessTokenFactory: () => localStorage.getItem("token") })
            .build();

        let startFun = async () => {
            try {
                await signalRUtil.broadcastConnection.start();
            } catch (err) {
                console.log(err);
                setTimeout(startFun, 5000);
            }
        }

        signalRUtil.broadcastConnection.onclose(startFun);

        await startFun();
    }

    // 开启连接
    static async beginStateConnection() {

        signalRUtil.stateConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${Configuration.BaseUrl}/state`, { accessTokenFactory: () => localStorage.getItem("token") })
            .build();

        let startFun = async () => {
            try {
                await signalRUtil.stateConnection.start();
            } catch (err) {
                console.log(err);
                setTimeout(startFun, 5000);
            }
        }

        signalRUtil.stateConnection.onclose(startFun);

        await startFun();
    }
}