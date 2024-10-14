import React, { useEffect, useState } from "react";
import { Box, Modal, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import MDTypography from "./MDTypography";
import axios from "axios";

const TriggerModal = React.memo(
  ({ icon, triggerTitle, onCloseTrigger, triggerModal, triggerModalData }) => {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const { user, sosItem } = triggerModalData || {};

    useEffect(() => {
      if (sosItem && sosItem.latitude && sosItem.longitude) {
        getAddressFromCoordinates(sosItem.latitude, sosItem.longitude);
      }
    }, [sosItem]);

    const getAddressFromCoordinates = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`
        );
        const address = response.data.results[0].formatted_address;
        setAddress(address);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    if (!user || !sosItem) {
      return null;
    }

    const renderInfo = (label, value) => (
      <div style={styles.infoContainer}>
        <MDTypography
          variant="h6"
          color="black"
          fontWeight="bold"
          fontSize="20px"
          style={styles.label}
        >
          {label}
        </MDTypography>
        <div style={styles.dashedLine}></div>
        <MDTypography
          variant="h6"
          color="black"
          fontWeight="medium"
          fontSize="20px"
          style={{
            maxWidth: value === "address" ? "none" : "60%", // Set maximum width for non-address values
            overflow: "hidden", // Hide overflow to prevent overlapping with dashed line
          }}
        >
          {value}
        </MDTypography>
      </div>
    );

    const BatteryIcon = ({ percentage }) => {
      const batteryStyle = {
        position: "relative",
        width: "40px", // Adjust width as needed
        height: "18px", // Adjust height as needed
        border: "1px solid #000",
        backgroundColor: "#fff",
        overflow: "visible", // Set overflow to "visible"
        marginTop: "5px", // Adjust margin-top as needed
      };

      const barStyle = {
        position: "absolute",
        top: "1px",
        left: "1.5px",
        bottom: "1px",
        width: `${Math.min(percentage, 95)}%`, // Cap at 95% to ensure the little bar remains visible
        backgroundColor: "#f44336",
      };

      const positiveEndStyle = {
        position: "absolute",
        right: "-2.9px", // Adjust positioning to move it outside the border
        top: "50%",
        transform: "translateY(-50%)",
        width: "2.9px", // Adjust width as needed
        height: "9px", // Adjust height as needed
        backgroundColor: "#000", // Adjust color as needed
      };

      return (
        <div style={batteryStyle}>
          <div style={barStyle}></div>
          <div
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "10px",
            }}
          >
            {percentage}%
          </div>
          <div style={positiveEndStyle}></div>
        </div>
      );
    };

    return (
      <Modal
        open={triggerModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClose={onCloseTrigger}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="col-md-9 col-sm-9 col-lg-6" style={styles.modalContainer}>
          <Button onClick={onCloseTrigger} style={styles.closeButton}>
            <img
              src={require("../assets/Cross.png")}
              alt="post image error"
              id={"9"}
              style={styles.closeIcon}
            />
            Close
          </Button>
          {icon ? (
            <img
              src={require("../assets/images/Location.png")}
              alt="post image error"
              id={"9"}
              style={styles.locationIcon}
            />
          ) : (
            <div
              style={{
                width: "80px", // Adjust width as needed
                height: "80px", // Adjust height as needed
                borderRadius: "50%", // Make it a circle
                backgroundColor: "transparent",
                border: "2px solid pink",
                display: "flex", // Center the content horizontally
                alignItems: "center", // Center the content vertically
                justifyContent: "center", // Center the content horizontally
                boxSizing: "border-box", // Ensure that border is included in the width/height calculation
                overflow: "hidden", // Hide overflow content
              }}
            >
              <BatteryIcon percentage={sosItem.BatteryLevel} />
            </div>
          )}

          <MDTypography
            variant="h6"
            color="black"
            fontWeight="bold"
            fontSize="24px"
            style={styles.triggerTitle}
          >
            {triggerTitle}
          </MDTypography>
          {renderInfo("Name", user.userName)}
          {renderInfo("Date", sosItem.Date)}
          {renderInfo("Phone No", user.userPhone)}
          {renderInfo("State", sosItem.State)}
          {renderInfo("City/Town", sosItem.City)}
          {renderInfo("User Status", user.IsMoving ? "Moving" : "Not Moving")}
          {renderInfo("Location Tag", address)}
          <Box style={styles.buttonContainer}>
            <Button variant="contained" style={styles.dispatchButton}>
              Dispatch
            </Button>
            <Button
              onClick={() => navigate(`/LocateSos/${sosItem.latitude}/${sosItem.longitude}`)}
              variant="contained"
              style={styles.trackButton}
            >
              Track User
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }
);

const styles = {
  modalContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 20,
    height: "80vh",
    width: 500,
    alignItems: "center",
    overflowY: "auto",
  },
  closeButton: {
    textTransform: "none",
    color: "black",
    alignSelf: "flex-start",
    fontWeight: "normal",
    fontSize: "24px",
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  locationIcon: {
    width: 50,
    height: 50,
  },
  triggerTitle: {
    marginTop: "7px",
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    width: "100%",
    justifyContent: "space-between",
    paddingRight: "20px",
    paddingLeft: "20px",
  },
  dashedLine: {
    margin: "0 20px",
    flex: 1,
    height: "1px",
    backgroundImage: "linear-gradient(to right, #333 50%, transparent 50%)",
    backgroundSize: "4px 1px",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    marginTop: "20px",
  },
  dispatchButton: {
    width: "50%",
    backgroundColor: "green",
    color: "black",
    textTransform: "none",
    fontSize: 20,
    borderRadius: 0,
  },
  trackButton: {
    textTransform: "none",
    width: "50%",
    backgroundColor: "red",
    color: "black",
    fontSize: 20,
    borderRadius: 0,
  },
  label: {
    width: "20%", // Set a fixed width for the label
  },
};

export default TriggerModal;
