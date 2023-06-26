import React, { useState, useEffect, useContext } from "react";
import {networks} from "../../utils/networkConfig.json"
import { chainConfig } from "../../../src/types/NetworkConfig";
import "./switch.css";
import CustomNetworkForm from "./CustomNetworkForm";
import { NetworkContext } from "../ConfigProvider";
import { LocalNetwork } from "../../../src/types/NetworkHook";
const NetworkSwitch = () => {
  const [curChain, setCurChain] = useState(networks[0].name);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const network = useContext(NetworkContext) as LocalNetwork;
  let chains:any = JSON.parse(localStorage.getItem('chainConfig'));

  const handleTokenSelect = (n:chainConfig)=>{
    console.log(n.name);
    setCurChain(n.name);
    network.setNetworkConfig({
      chainID:n.chainId,
      RPC_URL:n.rpcUrl,
      URL:n.restUrl
    });
  }
  const displayForm = ()=>{
    setIsFormOpen(!isFormOpen);
  }
  return <div className="network-selector-wrapper">
    <div className="network-selector">
    <div>{curChain}</div>
    {chains && <div className="chain-drop-down">
    {chains.networks.map((n:chainConfig)=>{
      return <div onClick={()=>handleTokenSelect(n)}>{n.name}</div>
    })}
    </div>}
    </div>
    <button onClick={displayForm}>{isFormOpen?'Cancel':'Add New'}</button>
    {isFormOpen && <CustomNetworkForm/>}
  </div>;
};

export default NetworkSwitch;
