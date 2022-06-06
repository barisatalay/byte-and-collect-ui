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
    const [selectedCell, setSelectedCell] = useState<CellModel>(new CellModel(0, 0, 0.0, 0.0));
    const [updating, setUpdating] = useState(false);
    const [cellInfo, setCellInfo] = useState<CellModel[][]>([]);
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

            /*
            const minCellPrice = await gameContract.getMinCellPrice();
            const formatedMinCellPrice = ethers.utils.formatEther(minCellPrice);
            const firstCellPrice = await gameContract.getCellLastPrice(0, 0);
            const formatedFirstCellPrice = ethers.utils.formatEther(firstCellPrice);
            */
            const cellDataRemote = await gameContract.getCellBatch();
            setCellInfo(cellDataRemote);
            //console.log(qwe);
          } catch (error) {
            alert(error);
            console.log(error);
          }
        }
      }

      function onCellClick(x: number, y: number, cellInfo: CellModel) {
        const log = x + "-" + y +
                    " price: " + ethers.utils.formatEther(cellInfo.price) +
                    " newprice: " + ethers.utils.formatEther(cellInfo.newPrice);
        console.log(log);
        setSelectedCell(cellInfo);
        setIsOpen(true);
      }

      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //subtitle.style.color = "#f00";
      }
    
      function closeModal() {
        setIsOpen(false);
      }

      async function onBiteClick(selected: CellModel){
        //if (selected.x == 0 || selected.y == 0) return;
        console.log("Curr price: " + ethers.utils.formatEther(selected.price));
        console.log("Bite price: " + ethers.utils.formatEther(selected.newPrice));
        await props.gameContract.attackCell(selected.x, selected.y, {
          value: selected.newPrice
        })
        .then((res: any) =>{
          //console.log("İs Bignumber: " + BigNumberish.isBigNumberish(res.data)); 
          console.log(res)
          successBite(selected);
        }).catch((err: any) => {
          failedBite(selected, err);
        });
      }

      function failedBite(selected: CellModel, err: any) {
        alert(err.message);
      }

      async function successBite(selected: CellModel) {
        const depositePrice = await props.gameContract.getCellLastPrice(selected.x, selected.y);
        const newRemotePrice = await props.gameContract.getCellNewPrice(selected.x, selected.y);
        //setSelectedCell({...selectedCell, newPrice: newPrice, price : depositePrice});
        console.log("*************SUCCESS*************");
        console.log("Curr price: " + ethers.utils.formatEther(selected.price));
        console.log("Bite price: " + ethers.utils.formatEther(selected.newPrice));
        setSelectedCell(prevState =>({
          ...prevState,
          newPrice : newRemotePrice,
          price : depositePrice
        }));
        //setSelectedCell(selectedCell);

        //console.log("New price " + newPrice);
      }

      return (
    <div>
      <span>{updating ? "Loading" : ""}</span>
      <table>
        <tbody>
          {cellInfo.map((array, y) => {
            return (
              <tr key={y}>
                {array.map((cellInfo, x) => (
                  <td key={y + "-" + x}  onClick={() => onCellClick(x, y, cellInfo)}>
                    Bite Me?
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
        <p>Deposited Price: <b>{ ethers.utils.formatEther(selectedCell.price) }</b></p>
        <div className="cell_modal_btn cell_modal_btn_bite"  onClick={() => onBiteClick(selectedCell)}>Bite it!</div>
        <div className="cell_modal_btn cell_modal_btn_info">Information</div>
      </Modal>
      </div>
      );
}