import React from "react";

import { ethers } from "ethers";
import { CONTACT_ABI, CONTACT_ADDRESS } from "../../config";

export default function WalletComponent(props) {
  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => accountChangeHandler(res[0]));
        props.handleIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        props.handleSigner(signer);

        fetchCellInfo(signer);
      } catch (e) {
        console.log(e);
      }
    } else {
      disconnect();
    }
  }

  async function fetchCellInfo(signer) {
    if (typeof window.ethereum !== "undefined") {
      const gameContract = new ethers.Contract(
        CONTACT_ADDRESS,
        CONTACT_ABI,
        signer
      );
      try {
        const maxCellSize = await gameContract.getMaxCellSize();
        //setMaxCellSize(maxCellSize);
        console.log("Max Cell Size: " + maxCellSize);
        let cellData = [];
        for (var y = 1; y <= maxCellSize; y++) {
          let cell = [];
          for (var x = 1; x <= maxCellSize; x++) {
            const cellPrice = await gameContract.getCellLastPrice(x, y);

            //console.log("X: " + x + " Y: "+ y + " Cell Price: " + cellPrice);
            cell.push(ethers.utils.formatEther(cellPrice));
            //let a = Map();
            //a.set(x, cellPrice);
            //const cell = {y:y, info:{x:x, price:cellPrice}};
            //setCellInfo((cellInfo) => [...cellInfo, cell]);
          }
          cellData.push(cell);
        }
        props.handleCellInfo(cellData);
        //console.log(qwe);
      } catch (error) {
        alert(error.data);
        console.log(error);
      }
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
