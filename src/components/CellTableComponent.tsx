import { useState, useEffect } from "react";
import {CellModel} from "../models/DataModel"
import { ethers } from "ethers";
import Modal from "react-modal";

const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      minWidth: "400px",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#EEEEEE",
    },
  };

export default function CellTableComponent(props: any) {
    const [selectedCell, setSelectedCell] = useState<CellModel>(new CellModel(0, 0, 0.0));
    const [updating, setUpdating] = useState(false);
    const [cellInfo, setCellInfo] = useState<string[][]>([]);
    const [maxCellSize, setMaxCellSize] = useState(0);
    const [modalIsOpen, setIsOpen] = useState(false);

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

    function beginTableUpdate() {
        setUpdating(true);
    }
    function endTableUpdate() {
        setUpdating(false);
    }

    async function fetchCellInfo(gameContract: any) {
        if (typeof window.ethereum !== "undefined") {
          try {
            console.log("FetchCellInfo Begin");
            const maxCellSize = await gameContract.getMaxCellSize();
            setMaxCellSize(maxCellSize);
            console.log("Max Cell Size: " + maxCellSize);
            let cellData: string[][] = [];
            //TODO tam liste için bir fonksiyon hazırlanacak
            for (var y = 1; y <= maxCellSize; y++) {
              let cell: string[] = [];
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

      function onCellClick(x: number, y: number) {
        console.log(x + "-" + y + ": " + cellInfo[y][x]);
        setSelectedCell( new CellModel(x, y, 0.0));
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
        <h1>Cell: {selectedCell.x + " - " + selectedCell.y}</h1>

        <div className="cell_modal_btn cell_modal_btn_bite">Bite it!</div>
        <div className="cell_modal_btn cell_modal_btn_info">Information</div>
      </Modal>
      </div>
      );
}