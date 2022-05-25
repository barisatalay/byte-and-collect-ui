import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import WalletComponent from './components/WalletComponent'
import CellTableComponent from './components/CellTableComponent'
import {UserModel} from "./models/DataModel"
import { ethers, Contract } from "ethers";
import { CONTACT_ABI, CONTACT_ADDRESS } from "./models/config";

function App() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [gameContract, setGameContract] = useState<Contract>();
  const [signer, setSigner] = useState(undefined);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  useEffect(() => {
    if (signer != undefined) prepareContract();
  }, [signer]);

  function prepareContract() {
    const newGameContract = new ethers.Contract(
      CONTACT_ADDRESS,
      CONTACT_ABI,
      signer
    );
    setGameContract(newGameContract);
  }

  function handleWalletConnected(connected: boolean) {
    setWalletConnected(connected);
  }

  function handleUserData(user: UserModel) {
    //TODO
  }

  function handleSigner(signer: any) {
    setSigner(signer);
  }

  return (
    (!hasMetamask) ? <></> :
    (
      <>
    <WalletComponent handleWalletConnected={handleWalletConnected} handleUserData={handleUserData} handleSigner={handleSigner}/>
    <CellTableComponent gameContract={gameContract} connected={walletConnected}/>
    </>
    )
  );
}

export default App;
