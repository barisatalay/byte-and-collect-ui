import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function CellTableComponent(props) {
  const [selectedCell, setSelectedCell] = useState({
    x: "",
    y: "",
    lastPrice: 0.0,
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cellInfo, setCellInfo] = useState([]);
  const [maxCellSize, setMaxCellSize] = useState(0);

  //et subtitle;

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
    setSelectedCell({
      x: "" + x,
      y: "" + y,
      lastPrice: 0.0,
    });
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
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
                  <td key={y + "-" + x}>
                    <button onClick={() => onCellClick(x, y)}>Attack</button>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Cell Model"
      >
        <h2>{selectedCell.x + " - " + selectedCell.y}</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
      </Modal>
    </div>
  );
}
