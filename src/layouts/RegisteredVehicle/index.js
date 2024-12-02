// import React from 'react'

// export default function RegisteredVehicle() {
//   return (
//     <div>RegisteredVehicle</div>
//   )
// }

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set, get, remove } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { Box, Modal } from "@mui/material";
import ImageModal from "components/ImageModal";
import EditVehicleModal from "components/VehicleEditModal";
import { toast } from "react-toastify";
import { getCurrentAdminState } from "Utils/Functions";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function RegisteredVehicle() {
  const [rows, setRows] = useState([]);
  const allData = useSelector((state) => state.data.allData);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [vehicleModal, setVehicleModal] = useState(false);

  const [editedVehicle, setEditedVehicle] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(null); // State to store the selected user ID

  // Function to open the modal for editing a vehicle
  const openModal = (vehicle, userId) => {
    setEditedVehicle(vehicle);
    setVehicleModal(true);
    setSelectedUserId(userId);
  };

  // Function to close the modal
  const closeModal = () => {
    setVehicleModal(false);
    setEditedVehicle(null); // Reset editedVehicle
    setSelectedUserId(null); // Reset selected user ID
  };

  const [search, setSearchText] = useState(null);

  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  //   const { columns } = authorsTableData();
  const commonHeaderStyle = { color: "blue", fontWeight: "bold" }; // Adjust the color and other styles as needed

  const columns = [
    { Header: <span style={commonHeaderStyle}>SR</span>, accessor: "SR", align: "center" },
    { Header: <span style={commonHeaderStyle}>Name</span>, accessor: "Name", align: "center" },
    { Header: <span style={commonHeaderStyle}>Number</span>, accessor: "Number", align: "center" },
    { Header: <span style={commonHeaderStyle}>Pin No</span>, accessor: "Pin", align: "center" },
    { Header: <span style={commonHeaderStyle}>Image</span>, accessor: "Image", align: "center" },
    { Header: <span style={commonHeaderStyle}>Action</span>, accessor: "action", align: "center" },
  ];

  const naivgate = useNavigate();
  let user = localStorage.getItem("user");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
    getData();
  }, [allData]);

  // const addUserStateToUsers = async () => {
  //   const database = getDatabase(); // Use getDatabase() to obtain a reference to the Firebase database
  //   const usersRef = ref(database, "users");

  //   try {
  //     // Fetch users from Firebase
  //     const snapshot = await get(usersRef);
  //     const users = snapshot.val();

  //     // Add userState property to each user object
  //     const updatedUsers = {};
  //     Object.keys(users).forEach((userId) => {
  //       updatedUsers[userId] = {
  //         ...users[userId],
  //         userState: "Punjab", // You can set any value for userState here
  //       };
  //     });

  //     // Update users in the database
  //     await set(usersRef, updatedUsers);
  //     console.log("User states updated successfully");
  //   } catch (error) {
  //     console.error("Error updating user states:", error);
  //   }
  // };

  const getData = async () => {
    setLoading(true);
    setRows([]);

    try {
      const database = getDatabase();
      const usersRef = ref(database, "/users");

      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city

      // Use get method to fetch data once
      get(usersRef)
        .then((snapshot) => {
          const usersData = snapshot.val();
          const dataArray = [];
          let index = 0;

          for (const userId in usersData) {
            if (usersData.hasOwnProperty(userId)) {
              const user = usersData[userId];

              // Extract userState from user object
              const userCurrentState = user.userState;
              console.log("userCurrentState--->" + userCurrentState);

              // Check if the userState matches the currentAdminState
              if (
                user &&
                user.Registered_Vehicles &&
                (allData || userCurrentState.toLowerCase() === currentAdminState.toLowerCase())
              ) {
                for (const vehicleId in user.Registered_Vehicles) {
                  if (user.Registered_Vehicles.hasOwnProperty(vehicleId)) {
                    const vehicle = user.Registered_Vehicles[vehicleId];
                    index++;

                    const rowItem = {
                      SR: index,
                      Name: vehicle.vehicleName,
                      Number: vehicle.vehicleNumber,
                      Pin: vehicle.Pin,
                      Image: (
                        <img
                          onClick={() => handleImageClick(vehicle.imgVehicle)}
                          src={vehicle.imgVehicle}
                          alt="Not Available"
                          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                      ),
                      action: (
                        <>
                          <button
                            type="button"
                            key={vehicleId}
                            onClick={(e) => {
                              openModal(vehicle, userId); // Pass vehicle data and userId when the "Edit" button is clicked
                            }}
                            className="btn btn text-light btn-success"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            key={vehicleId}
                            onClick={(e) => {
                              handleDeleteVehicle(vehicle, userId); // Pass vehicle data and userId when the "Edit" button is clicked
                            }}
                            className="btn btn text-light btn-danger ms-1"
                          >
                            Delete
                          </button>
                        </>
                      ),
                    };

                    setRows((prev) => [...prev, rowItem]);

                    const vehicleObject = {
                      userId: userId,
                      vehicleName: vehicle.vehicleName,
                      vehicleNumber: vehicle.vehicleNumber,
                      imgVehicle: vehicle.imgVehicle,
                    };

                    dataArray.push(vehicleObject);
                  }
                }
              }
            }
          }

          // Set the state with the array of objects
          // setData(dataArray);
        })
        .catch((error) => {
          console.error("Error getting data: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteVehicle = (vehicle, userId) => {
    try {
      const database = getDatabase();
      const vehicleRef = ref(database, `/users/${userId}/Registered_Vehicles/${vehicle.key}`);

      // Remove the vehicle entry from the database
      remove(vehicleRef)
        .then(() => {
          // Show a success message (you may implement this according to your UI)
          console.log("Vehicle deleted successfully!");
          toast.info(`Vehicle removed !`, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
          getData();
          // You might also want to refresh the data or update the UI accordingly
        })
        .catch((error) => {
          console.error("Error deleting vehicle:", error);
          // Handle the error (you may implement this according to your UI)
        });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      // Handle any potential errors (you may implement this according to your UI)
    }
  };

  const onClose = (event) => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    if (search == "") {
      getData();
    }

    if (search) {
      const filteredRows = rows.filter((row) => {
        const { Number = "", Name = "", Pin } = row; // Provide default values for destructuring
        const searchLowerCase = search.toLowerCase();
        return (
          Number.toLowerCase().startsWith(searchLowerCase) ||
          Name.toLowerCase().startsWith(searchLowerCase) ||
          Pin.toLowerCase().startsWith(searchLowerCase)
        );
      });

      setRows(filteredRows);
    }
  }, [search]);

  return (
    <DashboardLayout>
      <DashboardNavbar value={search} onChange={handleSearchChange} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
          {loading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Ensure horizontal centering
              }}
            >
              Loading...
            </div>
          ) : (
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Vehicles
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={true}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
      <ImageModal onClickImageData={onClickImageData} onClose={onClose} isModalOpen={isModalOpen} />
      <EditVehicleModal
        isOpen={vehicleModal}
        onClose={closeModal}
        vehicle={editedVehicle}
        userId={selectedUserId}
        getData={getData}
      />
      {/* <Footer /> */}
      {/* <div>
        <button onClick={addUserStateToUsers}>Update User States</button>
      </div> */}
    </DashboardLayout>
  );
}

export default RegisteredVehicle;
