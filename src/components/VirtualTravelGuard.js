import { Alert, Box, Modal } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const VirtualTravelGuard = React.memo(({ isOpen, onClose, notification, index, type }) => {
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
          height: 380,
          width: 500,
        }}
      >
        <div className="row">
          <h5 className="text-dark text-end pe-4" onClick={onClose}>
            X
          </h5>
          <h5 className="text-center pt-0 text-danger" style={{ marginTop: -15 }}>
            {type}
          </h5>
          <div className="col-5 ms-4 mt-4">
            <p style={{ fontSize: 14 }}>
              {/* <span className="fw-bold">Type :</span> {type} <br /> */}

              {notification.Place ? (
                <span className="fw-bold">
                  Current Location: {notification.Place} <br />
                </span>
              ) : null}
              {notification.ArrivalStation ? (
                <span className="fw-bold">
                  Arrival Destination: {notification.ArrivalStation} <br />
                </span>
              ) : null}

              <span className="fw-bold">
                Trip Date: {notification.ArrivalDate || notification.TripDate} <br />
              </span>
              <span className="fw-bold">
                Trip Time: {notification.ArrivalTime || notification.TripTime} <br />
              </span>
              <span className="fw-bold">
                Partner Type: {notification.PartenerType} <br />
              </span>
              <span className="fw-bold">
                Partner Name: {notification.Name} <br />
              </span>
              {notification.transportMode ? (
                <span className="fw-bold">
                  Transport Mode: {notification.transportMode} <br />
                </span>
              ) : (
                <span className="fw-bold">
                  Transport Mode: Own Transport <br />
                </span>
              )}

              {notification.currentLocTxt ? (
                <span className="fw-bold">
                  Arrival Station: {notification.currentLocTxt} <br />
                </span>
              ) : null}
              {notification.destLocTxt ? (
                <span className="fw-bold">
                  Destination: {notification.destLocTxt[0]} <br />
                </span>
              ) : null}
            </p>
          </div>

          <div className="col mt-2">
            {notification.WellBeingTripPic ? (
              <img
                src={notification.WellBeingTripPic}
                style={{ backgroundSize: "cover", borderRadius: 10 }}
                alt="no image attaiched by user"
                height={200}
                width={200}
              />
            ) : null}
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
              <div className="col mt-1">
                <button
                  className="btn btn-warning btn pe-4 ps-4"
                  onClick={() => {
                    onClose();

                    navigate(`/locate/${notification.userId}?userData=truck`);
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
        </div>
      </Box>
    </Modal>
  );
});

export default VirtualTravelGuard;
