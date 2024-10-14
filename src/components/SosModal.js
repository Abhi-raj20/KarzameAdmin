import { Alert, Box, Modal } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SosModalCom = React.memo(({ isOpen, onClose, notification, index, type }) => {
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
          height: 320,
          width: 550,
        }}
      >
        <div className="row">
          <h5 className="text-dark text-end pe-4" onClick={onClose}>
            X
          </h5>
          <h5 className="text-center pt-0 text-danger" style={{ marginTop: -15 }}>
            Emergency Alert
          </h5>
          <div className="col-6">
            <h6 className="ms-3 ">
              <span style={{ fontWeight: "bold" }}>Name:</span>
              {notification.userName}
            </h6>
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

            <h6 className="ms-3  mt-0 ">
              <span style={{ fontWeight: "bold" }}>City:</span>
              {notification.city}
            </h6>
            <h6 className="ms-3  mt-0 ">
              <span style={{ fontWeight: "bold" }}>State:</span>
              {notification.state}
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
              className="text-danger form-control-sm form-control w-50 ms-4 mb-2"
              style={{ fontSize: 12 }}
              href={`https://maps.google.com/?q=${notification.sosData.Latitude},${notification.sosData.Longitude}`}
            >
              {`https://maps.google.com/?q=${notification.sosData.Latitude},${notification.sosData.Longitude}`}
            </a>
            <div className="col-6 ms-3">
              <button
                className="btn btn-warning btn pe-4 ps-4"
                onClick={() => {
                  onClose();

                  navigate(
                    `/LocateSos/${notification.sosData.Latitude}/${notification.sosData.Longitude}?userData=siren`
                  );
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

export default SosModalCom;
