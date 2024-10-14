import { Box, Modal } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { update, ref, getDatabase } from "firebase/database";
import "react-toastify/dist/ReactToastify.css";
import { showStyledToast } from "./toastAlert";
import { toast } from "react-toastify";

const EditVehicleModal = ({ isOpen, onClose, vehicle, userId,getData }) => {
  const [editedVehicle, setEditedVehicle] = useState({});

  useEffect(() => {
    setEditedVehicle(vehicle);
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleSave = useCallback(async () => {
    try {
      if (!editedVehicle.vehicleName || !editedVehicle.vehicleNumber || !editedVehicle.imgVehicle) {
        throw new Error("Please fill in all required fields.");
      }

      const database = getDatabase();
      const vehicleRef = ref(database, `/users/${userId}/Registered_Vehicles/${vehicle.key}`);

      const newData = {
        vehicleName: editedVehicle.vehicleName,
        vehicleNumber: editedVehicle.vehicleNumber,
        Pin: editedVehicle.Pin, // Add other fields as needed
      };

      await update(vehicleRef, newData);

      toast.info(`Vehicle Updated !`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
      getData()

      //   showStyledToast("info", "" ,"Vehicle Updated !");
      onClose();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  }, [editedVehicle]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-vehicle-modal-title"
      aria-describedby="edit-vehicle-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
          borderRadius: 5,
        }}
      >
        <h2>Edit Vehicle</h2>
        <form className="p-3">
          <div className="mb-3">
            <label htmlFor="vehicleName" className="form-label">
              Vehicle Name:
            </label>
            <input
              type="text"
              id="vehicleName"
              name="vehicleName"
              className="form-control"
              value={editedVehicle?.vehicleName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleNumber" className="form-label">
              Vehicle Number:
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              className="form-control"
              value={editedVehicle?.vehicleNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imgVehicle" className="form-label">
              PIN
            </label>
            <input
              type="text"
              id="imgVehicle"
              name="Pin"
              className="form-control"
              value={editedVehicle?.Pin || ""}
              onChange={handleChange}
            />
          </div>
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditVehicleModal;
