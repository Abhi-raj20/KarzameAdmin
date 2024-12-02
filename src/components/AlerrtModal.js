import { Alert, Box, Modal } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AlertModal = React.memo(({ isOpen, onClose, notification, index, type }) => {
  // const navigate = useNavigate();
  // navigate("locate:239")
  const modalTop = 1 + index * 0.7 + "%";
  const navigate = useNavigate();
  console.log("vir item >>>>>>>>", notification);
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
        className=""
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: "10%",
          marginLeft: "auto",
          marginRight: "auto",
          height: 430,
          width: 550,
        }}
      >
        <div className="row">
          <h5 className="text-dark text-end pe-4" onClick={onClose}>
            X
          </h5>
          <h5 className="text-center pt-0 text-danger" style={{ marginTop: -15 }}>
            {notification.Type}
          </h5>
          <div className="col-6">
            <h6 className="ms-3 ">
              <span style={{ fontWeight: "bold" }}>
                {notification.Type === "Stop a stolen vehicle" ||
                notification.Type === "Snatched Car"
                  ? "Owner:"
                  : "Name:"}
              </span>

              {notification.userName}
            </h6>
            <h6 className="ms-3 ">
              <span style={{ fontWeight: "bold" }}>Date:</span>
              {notification.Date}
            </h6>

            {notification.Type === "Stop my stolen vehicle" ? (
              <>
                <h6 className="ms-3 ">
                  <span style={{ fontWeight: "bold" }}>vehicleNumber:</span>
                  {notification.vehicleNumber}
                </h6>
                <h6 className="ms-3 ">
                  <span style={{ fontWeight: "bold" }}>vehicleName:</span>
                  {notification.vehicleName}
                </h6>
              </>
            ) : null}

            <h6 className="ms-3  mt-0 ">
              <span style={{ fontWeight: "bold" }}>Phone:</span>
              {notification.userPhone}
            </h6>
            <h6 className="ms-3  mt-0 ">
              <span style={{ fontWeight: "bold" }}>Email:</span>
              {notification.userEmail}
            </h6>
            <h6 className="ms-3  mt-0 ">
              <span style={{ fontWeight: "bold" }}>Subscription:</span>
              {notification.subscription}
            </h6>
          </div>
          <div className="col-6 d-flex align-items-end justify-content-end pe-5 mt-0">
            <img
              height={120}
              width={150}
              style={{ borderRadius: 10 }}
              src={notification.userImage}
            />
          </div>
          <div className="row">
            <a
              target="_blank"
              className="text-danger form-control-sm form-control w-50 ms-4 mb-1"
              style={{ fontSize: 12 }}
              href={`https://maps.google.com/?q=${notification.Latitude},${notification.Longitude}`}
            >
              {`https://maps.google.com/?q=${notification.Latitude},${notification.Longitude}`}
            </a>
            <div className="col-6 ms-3 d-flex justify-content-start mt-3">
              <button
                className="btn btn-warning btn pe-3 ps-3 me-3"
                onClick={() => {
                  onClose();
                  console.log("whis data of not", notification);

                  navigate(
                    `/LocateSos/${notification.Latitude}/${notification.Longitude}?userData=siren`
                  );
                }}
              >
                Dispatch
              </button>
              <button
                className="btn btn-primary btn pe-3 ps-3"
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

export default AlertModal;
