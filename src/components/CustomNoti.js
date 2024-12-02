import { Alert, Box, Modal } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomNoti = React.memo(({ isOpen, onClose, notification, index, type }) => {
  // const navigate = useNavigate();
  // navigate("locate:239")
  const modalTop = 1 + index * 1 + "%";
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
        className="col-8"
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: "10%",
          marginLeft: "auto",
          marginRight: "auto",
          height: 350,
          width: 600,
        }}
      >
        <div className="row">
          <h5 className="text-dark text-end pe-4" onClick={onClose}>
            X
          </h5>
          <h5 className="text-center pt-0 text-danger" style={{ marginTop: -15 }}>
            {type}
          </h5>
          <div className="col-7 ms-4 mt-4">
            <p className="fs-6">
              <span className="fw-bold">User Name :</span> {notification.userName} <br />
              <span className="fw-bold">User Phone :</span> {notification.userPhone} <br />
              <span className="fw-bold">User Email :</span> {notification.userEmail} <br />
              <span className="fw-bold">Type :</span> {type}
              <br />
              <span className="fw-bold">Date :</span> {notification.Date}
              <br />
              <span className="fw-bold">Time :</span> {notification.Time}
              <br />
              <span className="fw-bold">Interval :</span> {notification.Interval} Minutes
              <br />
              <span className="fw-bold">Location :</span> {notification.Place}
            </p>
          </div>

          <div className="col mt-2">
            <img
              className="mt-4"
              style={{ backgroundSize: "cover" }}
              alt="no image attaiched by user"
              height={170}
              width={170}
              src={notification.userSelfie}
            />
            <div className="row">
              <div>
                <a
                  target="_blank"
                  className="text-danger mt-1 form-control-sm form-control  ms-0 mb-1"
                  style={{ fontSize: 12 }}
                  href={`https://maps.google.com/?q=${notification.LiveLatitude},${notification.LiveLongitude}`}
                >
                  {`https://maps.google.com/?q=${notification.LiveLatitude},${notification.LiveLongitude}`}
                </a>
              </div>
              <div className="col mt-0">
                <button
                  className="btn btn-warning btn btn-sm pe-3 ps-3"
                  onClick={() => {
                    onClose();

                    navigate(`/locate/${notification.userId}?userData=truck`);
                  }}
                >
                  Dispatch
                </button>
                <button
                  className="btn btn-primary btn btn-sm ms-1"
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
        </div>
      </Box>
    </Modal>
  );
});

export default CustomNoti;
