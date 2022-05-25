import React, { useState } from "react";
import { ethers } from "ethers";
import {UserModel} from "../models/DataModel"

export default function WalletComponent(props: any) {
    const [userData, setUserData] = useState<UserModel>(new UserModel("", 0.0));
    const [connected, setConnected] = useState(false);
    const [signer, setSigner] = useState<any>(undefined);

    async function connect() {  
        if (typeof window.ethereum !== "undefined") {
          try {
            await window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then((res: any) => accountChangeHandler(res[0]))
              .catch((err: any) => alert(err));
            setIsConnected(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            setSigner(signer);
            props.handleSigner(signer);
          } catch (e) {
            console.log(e);
          }
        } else {
          disconnect();
        }
      }
      function setIsConnected(connected: boolean){
          props.handleWalletConnected(connected);
          setConnected(connected);
      }
      function accountChangeHandler(account: any) {
        // Setting a balance
        getBalance(account);
      }
      function getBalance(address: any) {
        // Requesting balance method
        window.ethereum
          .request({
            method: "eth_getBalance",
            params: [address, "latest"],
          })
          .then((balance: any) => {
            // Setting balance
            handleUserData(address, balance)
          });
      }

    function handleUserData(address: any, balance: any) {
        const user = new UserModel(address, ethers.utils.formatEther(balance));
        setUserData(user);
        props.handleUserData(user);
    }
    function disconnect() {
        setSigner(undefined);
        setIsConnected(false);
    }

    function toggleWalletButton(connected: boolean) {
        if (connected) {
            disconnect();
        } else {
            connect();
        }
      }
    return (
      <div>
        <button onClick={()=> toggleWalletButton(connected)}>
        {!connected ? "Connect" : "Disconnect"}
      </button>
      {!connected ? <></>:
      <>
      <br />
      <span>
        Wallet: {userData.address} <br/>
        Balance: {userData.balance}</span>
      <br />
      </>
      }
      </div>
    )
}