import React from "react";

import { ethers } from "ethers";

export default function WalletComponent(props) {
  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => accountChangeHandler(res[0]))
          .catch((err) => alert(err));
        props.handleIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        props.handleSigner(signer);
      } catch (e) {
        console.log(e);
      }
    } else {
      disconnect();
    }
  }

  function accountChangeHandler(account) {
    // Setting a balance
    getBalance(account);
  }
  function getBalance(address) {
    // Requesting balance method
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        props.handleUserData({
          address: address,
          balance: ethers.utils.formatEther(balance),
        });
      });
  }

  function disconnect() {
    props.handleSigner(undefined);
    props.handleIsConnected(false);
  }

  function toggleWalletButton(connected) {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  }

  return (
    <button onClick={() => toggleWalletButton(props.connected)}>
      {!props.connected ? "Connect" : "Disconnect"}
    </button>
  );
}
