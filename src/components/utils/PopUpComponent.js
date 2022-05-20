import React, { useState, useEffect } from "react";

export default function PopUpComponent(props) {
  return props.visible ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={() => props.setVisible(false)}>
          Close
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}
