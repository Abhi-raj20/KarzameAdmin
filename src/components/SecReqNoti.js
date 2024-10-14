import { Alert, Box, Modal } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SecReqNoti = React.memo(({ isOpen, onClose, notification, index, type, name }) => {
  const modalTop = 1 + index * 1 + "%";

  const navigate = useNavigate();

  console.log("vir travel guard >>>>>>>>", notification);
  return (
    <Modal
      open={isOpen}
      // className="position-relative"
      style={{ borderRadius: 5, marginTop: modalTop }}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="col-5"
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: "10%",
          marginLeft: "auto",
          marginRight: "auto",
          height: "auto",
          paddingBottom: 20,
        }}
      >
        <div className="row">
          <h5 className="text-dark text-end pe-4" onClick={onClose}>
            X
          </h5>
          <h5 className="text-center pt-0 text-danger" style={{ marginTop: -15 }}>
            Armed Security Agents Request
          </h5>
          <div className="col ms-4 mt-2">
            <p style={{ fontSize: 14 }}>
              <span style={{ fontWeight: "bold" }}>Name:</span> {notification.userName} <br />
              <span style={{ fontWeight: "bold" }}>Phone:</span> {notification.userPhone} <br />
              <span style={{ fontWeight: "bold" }}>Email:</span> {notification.userEmail} <br />
              <span style={{ fontWeight: "bold" }}>Car Rentail:</span> {notification.CarRental}{" "}
              <br />
              <span style={{ fontWeight: "bold" }}>Pick up:</span> {notification.PickUpLooc} <br />
              <span style={{ fontWeight: "bold" }}>Destination:</span> {notification.DesLoc} <br />
              <span style={{ fontWeight: "bold" }}>Request Days:</span> {notification.RequestedDays}{" "}
              <br />
              <span style={{ fontWeight: "bold" }}>Request Men:</span> {notification.RequstedMen}{" "}
              <br />
              <span style={{ fontWeight: "bold" }}>Security network:</span>{" "}
              {notification.SecurityNetwork} <br />
              <span style={{ fontWeight: "bold" }}>Total charges:</span>{" "}
              {notification.TotoalCharges} <br />
            </p>
          </div>
          <div className="row">
            <div className="col mt-1 ms-3">
              <button
                className="btn btn-warning btn pe-4 ps-4"
                onClick={() => {
                  onClose();
                  navigate(`/locate/${notification.userId}`);
                }}
              >
                Dispatch
              </button>
              <button
                className="btn btn-primary btn pe-4 ps-4 ms-3"
                onClick={() => {
                  onClose();
                  navigate(`/UserProfile/${notification.userId}`);
                }}
              >
                See Profile
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
});

export default SecReqNoti;
