import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PopUpComponent from "../../utils/PopUpComponent";

export default function CellTableComponent(props) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cellInfo, setCellInfo] = useState([]);
  const [maxCellSize, setMaxCellSize] = useState(0);

  useEffect(() => {
    if (props.gameContract != undefined) {
      beginTableUpdate();
      try {
        fetchCellInfo(props.gameContract);
      } finally {
        endTableUpdate();
      }
    }
  }, [props.gameContract]);

  useEffect(() => {
    return () => {
      setCellInfo([]);
      console.log("componentWillUnmount");
    };
  }, []);

  useEffect(() => {
    if (!props.connected) setCellInfo([]);
  }, [props.connected]);

  async function fetchCellInfo(gameContract) {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("FetchCellInfo Begin");
        const maxCellSize = await gameContract.getMaxCellSize();
        setMaxCellSize(maxCellSize);
        console.log("Max Cell Size: " + maxCellSize);
        let cellData = [];
        for (var y = 1; y <= maxCellSize; y++) {
          let cell = [];
          for (var x = 1; x <= maxCellSize; x++) {
            const cellPrice = await gameContract.getCellLastPrice(x, y);
            //console.log("X: " + x + " Y: "+ y + " Cell Price: " + cellPrice);
            cell.push(ethers.utils.formatEther(cellPrice));
          }
          cellData.push(cell);
        }
        setCellInfo(cellData);
        //console.log(qwe);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    }
  }

  function beginTableUpdate() {
    setUpdating(true);
  }
  function endTableUpdate() {
    setUpdating(false);
  }
  function onCellClick(x, y) {
    console.log(x + "-" + y + ": " + cellInfo[y][x]);
    setPopupVisible(true);
  }
  function onPopUpClick() {
    alert("test");
  }

  return (
    <div>
      <span>{updating ? "Loading" : ""}</span>
      <table>
        <tbody>
          {cellInfo.map((array, y) => {
            return (
              <tr key={y}>
                {array.map((cell, x) => (
                  <td key={y + "-" + x} onClick={() => onCellClick(x, y)}>
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <PopUpComponent visible={popupVisible} setVisible={setPopupVisible}>
        <h3>My popup</h3>
        <p>This is Sparta!</p>
      </PopUpComponent>
    </div>
  );
}
