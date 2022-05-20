import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { CONTACT_ABI, CONTACT_ADDRESS } from "../src/config";
import WalletComponent from "../src/components/header/WalletComponent";
import CellTableComponent from "../src/components/page/main/CellTableComponent";

export default function Home() {
  const [gameContract, setGameContract] = useState(undefined);
  const [userData, setUserData] = useState({ address: "", balance: 0.0 });
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  useEffect(() => {
    if (signer != undefined) prepareContract(signer);
  }, [signer]);

  function prepareContract() {
    const newGameContract = new ethers.Contract(
      CONTACT_ADDRESS,
      CONTACT_ABI,
      signer
    );
    setGameContract(newGameContract);
  }

  function initListeners() {
    ethereum.on("chainChanged", async () => {
      alert("chainChanged");
    });
    //window.ethereum.on('connect', handler: (connectInfo: ConnectInfo) => void);
    window.ethereum.on("connect", async (connectInfo) => {
      alert("connect. " + connectInfo);
      //fetchCellInfo();
    });
    window.ethereum.on("disconnect", async () => {
      alert("disconnect");
    });
    window.ethereum.on("accountsChanged", async () => {
      alert("accountsChanged");
      disconnect();
    });
  }

  function handleUserData(data) {
    setUserData(data);
  }
  function handleIsConnected(isConnected) {
    setIsConnected(isConnected);
  }
  function handleSigner(signer) {
    setSigner(signer);
  }
  function handleCellInfo(cellInfo) {
    setCellInfo(cellInfo);
  }

  if (!hasMetamask) return "Please install metamask";

  return (
    <div>
      <WalletComponent
        title="Fetch All"
        connected={isConnected}
        handleUserData={handleUserData}
        handleIsConnected={handleIsConnected}
        handleSigner={handleSigner}
        handleCellInfo={handleCellInfo}
      />
      <br />
      <span>Wallet: {userData.address}</span>
      <br />
      <span>Balance: {userData.balance}</span>

      <div className="App">
        <CellTableComponent
          gameContract={gameContract}
          connected={isConnected}
        />
      </div>
    </div>
  );
}
