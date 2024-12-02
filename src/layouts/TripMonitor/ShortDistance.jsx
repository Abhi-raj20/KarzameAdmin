// Import statements remain the same
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import DriveEtaIcon from "@mui/icons-material/DriveEta";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";

// MUI components
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// Data
import tripMonitorAuthorTable from "layouts/tables/data/tripMonitorAuthorTable";
import { useCallback, useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, update, get } from "firebase/database";
import { dataBase, db } from "../../firebase";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, Modal, TextField, Typography } from "@mui/material";
import moment from "moment";
import { showStyledToast } from "components/toastAlert";
import { OpenInFull } from "@mui/icons-material";
import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";
import SosSection from "components/SosSection";
import { connectSocket, disconnectSocket, userLiveLocation } from '../../socket/SocketService';

// Import statements (remain unchanged)

function ShortDistance() {
    const navigate = useNavigate();
    const allData = useSelector((state) => state.data.allData);
    const [controller] = useMaterialUIController();
    const [rows, setRows] = useState([]);
    const { columns } = tripMonitorAuthorTable();
    const { loggedIn } = controller;
    const [status, setStatus] = useState("Connecting...");
    const [searchTxt, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onClickImageData, setOnClickImageData] = useState("");
    const [users, setUsers] = useState([]); // State to hold user data
  
    const handleImageClick = (url) => {
      setIsModalOpen(true);
      setOnClickImageData(url);
    };
  
    const onClose = () => {
      setIsModalOpen(false);
    };
  
    // Helper function to handle errors and show toast notifications
    const handleError = (message) => {
      console.error(message);
      toast.error(message);
    };
  
    // // // Fetch data from Firebase with error handling
    // const getData = async () => {
    //   setLoading(true);
    //   setRows([]);
    //   const dataBase = getDatabase();
    //   const usersRef = ref(dataBase, "/users");
  
    //   try {
    //     const snapShot = await get(usersRef);
  
    //     if (snapShot.exists()) {
    //       const data = snapShot.val();
    //       const newRows = [];
    //       let index = 0;
  
    //       for (const key in data) {
    //         if (data.hasOwnProperty(key)) {
    //           const user = data[key];
    //           const { ShortDistance_Escort } = user;
  
    //           for (const shortKey in ShortDistance_Escort) {
    //             const shortTrip = ShortDistance_Escort[shortKey];
    //             const stops = shortTrip.stops;
  
    //             let showStopLatitude;
    //             let showStopLongitude;
  
    //             for (const key in stops) {
    //               if (stops.hasOwnProperty(key)) {
    //                 const stop = stops[key];
    //                 showStopLatitude = stop.stopLatitude;
    //                 showStopLongitude = stop.stopLongitude;
    //               }
    //             }
  
    //             index += 1;
    //             newRows.push({
    //               Sr: index,
    //               Name: user.userName,
    //               VehicleReg: shortTrip.vehicleReg,
    //               VehicleImage: (
    //                 <img
    //                   onClick={() => handleImageClick(shortTrip.imgVehicle)}
    //                   src={shortTrip.imgVehicle}
    //                   alt="vehicle"
    //                   style={{ width: "50px", height: "50px", borderRadius: "50%" }}
    //                 />
    //               ),
    //               TripDate: shortTrip.ArrivalDate,
    //               IsMoving: (() => {
    //                 if (shortTrip.Trip_Status === "Moving") {
    //                   return (
    //                     <Button variant="contained" sx={{ backgroundColor: "green", color: "white" }}>
    //                       Running
    //                     </Button>
    //                   );
    //                 } else if (shortTrip.Trip_Status === "Arrived") {
    //                   return (
    //                     <Button variant="contained" sx={{ backgroundColor: "blue", color: "white" }}>
    //                       Arrived
    //                     </Button>
    //                   );
    //                 } else {
    //                   return (
    //                     <Button variant="contained" sx={{ backgroundColor: "red", color: "white" }}>
    //                       Stopped
    //                     </Button>
    //                   );
    //                 }
    //               })(),
    //               TripTime: shortTrip.TripTime,
    //               TripType: <h5>Short Distance</h5>,
    //               StartRide: (
    //                 <Link to={`/liveLocation/${shortTrip.LiveLatitude}/${shortTrip.LiveLongitude}`}>
    //                   Track
    //                 </Link>
    //               ),
    //               EndRide: (
    //                 <Link to={`/liveLocation/${showStopLatitude}/${showStopLongitude}`}>
    //                   Track
    //                 </Link>
    //               ),
    //               LiveLatitude: shortTrip.LiveLatitude,
    //               LiveLongitude: shortTrip.LiveLongitude,
    //             });
    //           }
    //         }
    //       }
  
    //       setRows(newRows);
    //     } else {
    //       handleError("No user data found in the database.");
    //     }
    //   } catch (error) {
    //     handleError("Error fetching data from Firebase.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
  

// Fetch data from Firebase with error handling
const getData = async () => {
  setLoading(true); // Indicate loading state
  setRows([]); // Clear rows before fetching
  const dataBase = getDatabase();
  const usersRef = ref(dataBase, "/users");

  try {
    const snapShot = await get(usersRef);

    if (snapShot.exists()) {
      const data = snapShot.val();
      const newRows = [];
      let index = 0;

      for (const userId in data) {
        if (data.hasOwnProperty(userId)) {
          const user = data[userId];
          const { ShortDistance_Escort = {} } = user; // Ensure fallback if ShortDistance_Escort is undefined

          for (const tripId in ShortDistance_Escort) {
            if (ShortDistance_Escort.hasOwnProperty(tripId)) {
              const shortTrip = ShortDistance_Escort[tripId];
              const stops = shortTrip.stops || {};

              // Extract the last stop's coordinates
              const lastStop = Object.values(stops).pop() || {};
              const { stopLatitude: showStopLatitude, stopLongitude: showStopLongitude } = lastStop;

              // Increment the index for each trip
              index += 1;

              // Build the row data
              newRows.push({
                Sr: index,
                Name: user.userName || "Unknown",
                VehicleReg: shortTrip.vehicleReg || "N/A",
                VehicleImage: (
                  <img
                    onClick={() => handleImageClick(shortTrip.imgVehicle)}
                    src={shortTrip.imgVehicle}
                    alt="vehicle"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                ),
                TripDate: shortTrip.ArrivalDate || "N/A",
                IsMoving: (
                  <Button
                    className={ shortTrip.Trip_Status === "Moving"? "text-white":"text-black"}
                    variant="contained"
                    sx={{
                      backgroundColor:
                        shortTrip.Trip_Status === "Moving"
                          ? "green"
                          : shortTrip.Trip_Status === "Arrived"
                          ? "yellow"
                          : "red",
                      color:
                        shortTrip.Trip_Status === "Moving"
                          ? "white" // Text color for "Moving"
                          : shortTrip.Trip_Status === "Arrived"
                          ? "black" // Text color for "Arrived"
                          : "white", // Text color for "Stopped"
                    }}
                  >
                    {shortTrip.Trip_Status === "Moving"
                      ? "Running"
                      : shortTrip.Trip_Status === "Arrived"
                      ? "Arrived"
                      : "Stopped"}
                  </Button>
                ),
                TripTime: shortTrip.TripTime || "N/A",
                TripType: <h5>Short Distance</h5>,
                StartRide: (
                  <Link to={`/liveLocation/${shortTrip.LiveLatitude}/${shortTrip.LiveLongitude}`}>
                    Track
                  </Link>
                ),
                EndRide: (
                  <Link to={`/liveLocation/${showStopLatitude}/${showStopLongitude}`}>
                    Track
                  </Link>
                ),
                LiveLatitude: shortTrip.LiveLatitude || "N/A",
                LiveLongitude: shortTrip.LiveLongitude || "N/A",
              });
            }
          }
        }
      }
   console.log("this a newRows....",newRows);
   
      // Sort newRows in descending order based on TripDate
      newRows.sort((a, b) => {
        // Convert dates from "DD/MM/YYYY" to valid Date objects
        console.log("a trip date...",a.TripDate);
        console.log("b trip date....",b.TripDate);
        
        const dateA = new Date(a.TripDate.split("/").reverse().join("-"));
        const dateB = new Date(b.TripDate.split("/").reverse().join("-"));
      
        // Compare the dates in ascending order
        return dateB - dateA; 
      });

   console.log("this a newRows....123....",newRows);

      setRows(newRows); // Update rows with the sorted data
    } else {
      handleError("No user data found in the database.");
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    handleError("Error fetching data from Firebase.");
  } finally {
    setLoading(false); // Stop loading state
  }
};


    // Fetch data from Firebase with error handling
//     const getData = async () => {
//       setLoading(true);
//       setRows([]);
//       const dataBase = getDatabase();
//       const usersRef = ref(dataBase, "/users");
    
//       try {
//         const snapShot = await get(usersRef);
    
//         if (snapShot.exists()) {
//           const data = snapShot.val();
//           const allTrips = []; // Collect all trips here
//           let index = 0;
    
//           for (const key in data) {
//             if (data.hasOwnProperty(key)) {
//               const user = data[key];
//               const { ShortDistance_Escort } = user;
    
//               for (const shortKey in ShortDistance_Escort) {
//                 const shortTrip = ShortDistance_Escort[shortKey];
//                 const stops = shortTrip.stops;
    
//                 let showStopLatitude;
//                 let showStopLongitude;
    
//                 for (const stopKey in stops) {
//                   if (stops.hasOwnProperty(stopKey)) {
//                     const stop = stops[stopKey];
//                     showStopLatitude = stop.stopLatitude;
//                     showStopLongitude = stop.stopLongitude;
//                   }
//                 }
    
//                 // Push each trip with user details
//                 allTrips.push({
//                   userName: user.userName,
//                   trip: shortTrip,
//                   showStopLatitude,
//                   showStopLongitude,
//                 });
//               }
//             }
//           }
    
//           // Sort all trips by the `ArrivalDate` field (newest first)
//           // Sorting by date (ascending order)
//           allTrips.sort((a, b) => {
//   // Convert "DD / MM / YYYY" to Date object
//   const parseDate = (dateStr) => {
//     const [day, month, year] = dateStr.split(" / ").map(Number); // Split and convert to numbers
//     return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
//   };

//   return parseDate(a.trip.ArrivalDate) - parseDate(b.trip.ArrivalDate);
// });  
//           // allTrips.sort((a, b) => new Date(b.trip.ArrivalDate) - new Date(a.trip.ArrivalDate));
//          console.log("get all Trips......",allTrips);
         
//           // Map sorted trips to rows
//           const newRows = allTrips.map((item, idx) => {
//             const { userName, trip, showStopLatitude, showStopLongitude } = item;
//        console.log("new Rows......",newRows);
       
//             return {
//               Sr: idx + 1,
//               Name: userName,
//               VehicleReg: trip.vehicleReg,
//               VehicleImage: (
//                 <img
//                   onClick={() => handleImageClick(trip.imgVehicle)}
//                   src={trip.imgVehicle}
//                   alt="vehicle"
//                   style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//                 />
//               ),
//               TripDate: trip.ArrivalDate,
//               IsMoving: (() => {
//                 if (trip.Trip_Status === "Moving") {
//                   return (
//                     <Button variant="contained" sx={{ backgroundColor: "green", color: "white" }}>
//                       Running
//                     </Button>
//                   );
//                 } else if (trip.Trip_Status === "Arrived") {
//                   return (
//                     <Button variant="contained" sx={{ backgroundColor: "blue", color: "white" }}>
//                       Arrived
//                     </Button>
//                   );
//                 } else {
//                   return (
//                     <Button variant="contained" sx={{ backgroundColor: "red", color: "white" }}>
//                       Stopped
//                     </Button>
//                   );
//                 }
//               })(),
//               TripTime: trip.TripTime,
//               TripType: <h5>Short Distance</h5>,
//               StartRide: (
//                 <Link to={`/liveLocation/${trip.LiveLatitude}/${trip.LiveLongitude}`}>
//                   Track
//                 </Link>
//               ),
//               EndRide: (
//                 <Link to={`/liveLocation/${showStopLatitude}/${showStopLongitude}`}>
//                   Track
//                 </Link>
//               ),
//               LiveLatitude: trip.LiveLatitude,
//               LiveLongitude: trip.LiveLongitude,
//             };
//           });
    
//           setRows(newRows);
//         } else {
//           handleError("No user data found in the database.");
//         }
//       } catch (error) {
//         handleError("Error fetching data from Firebase.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
 
    useEffect(() => {
      const onConnect = () => {
        setStatus("Connected");
        console.log("Connection established");
      };
  
      const onDisconnect = () => {
        setStatus("Disconnected");
        console.log("Disconnected from server");
      };
  
      const handleLiveLocationUpdate = (userLiveLocation) => {
        setRows((prevRows) =>
          prevRows.map((row) => {
            const updatedUser = userLiveLocation.find((user) => user.id === row.Sr);
            return updatedUser
              ? { ...row, LiveLatitude: updatedUser.userLatitude, LiveLongitude: updatedUser.userLongitude }
              : row;
          })
        );
        setLoading(false);
      };
  
      connectSocket(onConnect, onDisconnect, handleLiveLocationUpdate);
  
      return () => {
        disconnectSocket();
      };
    }, []);
  
    useEffect(() => {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/authentication/sign-in");
      }
      getData();
    }, [allData]);
  
    // Debounced search functionality to optimize search behavior
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (!searchTxt) {
          getData();
        } else {
          const filteredRows = rows.filter((row) => {
            const { Phone, Name } = row;
            const searchWithoutPlus = searchTxt.replace(/\+/g, "");
            const phoneWithoutPlus = Phone?.replace(/\+/g, "");
  
            return (
              phoneWithoutPlus?.startsWith(searchWithoutPlus) ||
              Name?.toLowerCase().startsWith(searchWithoutPlus.toLowerCase())
            );
          });
  
          setRows(filteredRows);
        }
      }, 300); // Delay for debounced search
  
      return () => clearTimeout(timeoutId); // Clean up the timeout when searchTxt changes
    }, [searchTxt]);
  
    const handleSearchChange = (event) => {
      setSearchText(event.target.value);
    };
  
    return (
      <DashboardLayout>
        <DashboardNavbar value={searchTxt} onChange={handleSearchChange} />
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
                  justifyContent: "center",
                }}
              >
                Loading...
              </div>
            ) : (
              <>
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
                      <ToastContainer />
                      <MDTypography variant="h6" color="white">
                        Short Distance Escort
                      </MDTypography>
                    </MDBox>
  
                    <MDBox pt={3}>
                      {rows.length > 0 ? (
                        <DataTable
                          table={{ columns, rows }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                      ) : (
                        <EmptyData />
                      )}
                    </MDBox>
                  </Card>
                  <ImageModal
                    onClickImageData={onClickImageData}
                    onClose={onClose}
                    isModalOpen={isModalOpen}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }
  
  export default ShortDistance;
  