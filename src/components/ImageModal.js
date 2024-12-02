import { Box, Modal, Button } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import the close icon
import MDTypography from "./MDTypography";

const ImageModal = React.memo(({ isModalOpen, onClose, onClickImageData }) => {
  const PLACEHOLDER =
    "https://firebasestorage.googleapis.com/v0/b/karzame-f00a9.appspot.com/o/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg?alt=media&token=5c795057-3ee1-4496-8fb4-08d4bdc3282a&_gl=1*cd7xe1*_ga*NDMyMjU1MzgwLjE2OTY3ODM4NTI.*_ga_CW55HF8NVT*MTY5OTMwMDg3Ny42NS4xLjE2OTkzMDExMTMuNTAuMC4w";
  return (
    <Modal
      open={isModalOpen}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="col-md-9 col-sm-9 col-lg-6"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          borderRadius: 20,
          height: 330,
          width:500,
          alignItems: "center",
          justifyContent: "center",
          padding: "20px", // Add padding for spacing
        }}
      >
        <Button
          onClick={onClose}
          style={{
            color: "white",
            alignSelf: "flex-end",
            fontSize: "24px", // Adjust the font size of the button
          }}
        >
          {/* <CloseIcon style={{ fontSize: 26 }}/> */}
          Close
        </Button>

        <img
          src={onClickImageData ? onClickImageData : PLACEHOLDER}
          alt="post image error"
          id={"9"}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
        />
      </Box>
    </Modal>
  );
});

export default ImageModal;
