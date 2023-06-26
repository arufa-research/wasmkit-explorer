import { WebSocketClient } from "@terra-money/terra.js";
import { useContext, useEffect, useState } from "react";
import { NetworkContext } from "../../src/components/ConfigProvider";
import { LocalNetwork } from "../../src/types/NetworkHook";

export const useWebSocket = ()=>{
    const network = useContext(NetworkContext) as LocalNetwork;
    const [txnWSClient, setTxnWSClient] = useState(null);
    const [blockWSClient, setBlockWSClient] = useState(null);

    useEffect(() => {
        let txWs = new WebSocketClient(getWsUrlFromRpc(network.config.RPC_URL));
        let blockWs = new WebSocketClient(getWsUrlFromRpc(network.config.RPC_URL));
        setTxnWSClient(txWs);
        setBlockWSClient(blockWs);
        return () => {
            if (txnWSClient) {
              txnWSClient.destroy();
            }
            if(blockWSClient){
                blockWs.destroy()
            }
        };
    }, [network]);


    const getWsUrlFromRpc = (rpcUrl:string)=>{
        const wsUrl = rpcUrl.replace("http","ws")+"websocket";
        console.log(wsUrl);
        return wsUrl;
    }

    return {
        txnWSClient,blockWSClient
    }

}