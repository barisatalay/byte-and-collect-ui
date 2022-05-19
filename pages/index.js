import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { CONTACT_ABI, CONTACT_ADDRESS } from "../src/config";
import WalletComponent from "../src/components/header/WalletComponent";

export default function Home() {
  const [userData, setUserData] = useState({ address: "", balance: 0.0 });
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [cellInfo, setCellInfo] = useState([]);
  const [maxCellSize, setMaxCellSize] = useState(0);
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
    //initListeners();
  });

  // async function connect() {
  //   if (typeof window.ethereum !== "undefined") {
  //     try {
  //       await ethereum
  //         .request({ method: "eth_requestAccounts" })
  //         .then((res) => accountChangeHandler(res[0]));
  //       setIsConnected(true);
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner()
  //       setSigner(signer);

  //       fetchCellInfo(signer);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   } else {
  //     //setIsConnected(false);
  //     disconnect();
  //   }
  // }

  // function disconnect() {
  //   setSigner(undefined);
  //   setIsConnected(false);
  // }

  // function WalletComponent(props){
  //   return (
  //     <button onClick={() => toggleWalletButton(props.connected)}>
  //     {!props.connected ? ("Connect") : ("Disconnect")}
  //     </button>
  //     );
  // }

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
  // Function for getting handling all events
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
        setUserData({
          address: address,
          balance: ethers.utils.formatEther(balance),
        });
      });
  }

  if (!hasMetamask) return "Please install metamask";

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
        <table>
          <tbody>
            {cellInfo.map((array, y) => {
              return (
                <tr key={y} style={{ border: 1 }}>
                  {array.map((cell, x) => (
                    <td key={y + "" + x}>{cell}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
