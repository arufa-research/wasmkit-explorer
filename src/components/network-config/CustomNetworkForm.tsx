import React, { useState } from 'react'
// import fs from 'fs';
import "../../utils/networkConfig.json"
import { chainConfig } from '../../../src/types/NetworkConfig';

const CustomNetworkForm = () => {
    const [name, setName] = useState('');
    const [chainId, setChainId] = useState('');
    const [rpcUrl, setRpcUrl] = useState('');
    const [restUrl, setRestUrl] = useState('');

    const path = "../../utils/networkConfig.json";

    const handleAddNetwork = ()=>{
        // let list = fs.readFileSync(path);
        const list = JSON.parse(localStorage.getItem('chainConfig'));
        const newNetwork :chainConfig= {
            name,
            chainId,
            rpcUrl,
            restUrl
        }
        list['networks'].push(newNetwork);
        localStorage.setItem('chainConfig', JSON.stringify(list));
        // console.log(list['networks'], newNetwork);
        
    }

  return (
    <div className='custom-network-form'>
        <label>Name</label>
        <input value={name}  onChange={(e)=>setName(e.target.value)} type='text' />
        <label>Chain-ID</label>
        <input value={chainId}  onChange={(e)=>setChainId(e.target.value)} type='text' />
        <label>RPC URL</label>
        <input  value={rpcUrl} onChange={(e)=>setRpcUrl(e.target.value)} type='text' />
        <label>REST URL</label>
        <input  value={restUrl} onChange={(e)=>setRestUrl(e.target.value)} type='text' />
        <button onClick={handleAddNetwork}>Add</button>
    </div>
  )
}

export default CustomNetworkForm