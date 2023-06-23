import React, { useState, useEffect } from "react";
import {networks} from "../../utils/networkConfig.json"
import { chainConfig } from "../../../src/types/NetworkConfig";
import "./switch.css";
import CustomNetworkForm from "./CustomNetworkForm";
const NetworkSwitch = () => {
  const [curChain, setCurChain] = useState(networks[0].name);
  const [isFormOpen, setIsFormOpen] = useState(false);
  let chains:any = JSON.parse(localStorage.getItem('chainConfig'));

  const handleTokenSelect = (n:chainConfig)=>{
    console.log(n.name);
    setCurChain(n.name);
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
