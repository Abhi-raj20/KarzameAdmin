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

// TripMonitor component
function LongDistance() {
    const navigate = useNavigate();
    const allData = useSelector((state) => state.data.allData);
    const [controller, dispatch] = useMaterialUIController();

    const [rows, setRows] = useState([]);
    const { columns } = tripMonitorAuthorTable();
    const { loggedIn } = controller;

    const [searchTxt, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onClickImageData, setOnClickImageData] = useState("");

    const handleImageClick = (url) => {
        setIsModalOpen(true);
        setOnClickImageData(url);
    };
    const onClose = () => {
        setIsModalOpen(false);
    };


    const getData = async () => {
        setLoading(true);
        setRows([]);
        const dataBase = getDatabase();
        const usersRef = ref(dataBase, "/users");

        try {
            const snapShot = await get(usersRef);

            if (snapShot.exists()) {
                const data = snapShot.val();
                const newRows = [];
                let index = 0;

                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const user = data[key];

                        const { ShortDistance_Escort, UserTour } = user;
                        if (allData) {
                            // Combine Long Distance Trips
                            for (const longKey in UserTour) {
                                const longTrip = UserTour[longKey];

                                index += 1;
                                newRows.push({
                                    Sr: index,
                                    Name: user.userName,
                                    VehicleReg: longTrip.regNo,
                                    VehicleImage: (
                                        <img
                                            onClick={() => handleImageClick(user.userImage)}
                                            src={user.userImage}
                                            alt="vehicle"
                                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                        />
                                    ),
                                    TripDate: longTrip.selectedDate,
                                    IsMoving: (() => {
                                        if (longTrip.Trip_Status === 'Moving') {
                                          return (
                                            <Button variant="contained" className="text-white" sx={{ backgroundColor: "green", color: "white" }}>
                                              Running
                                            </Button>
                                          ); // Custom green color
                                        } else if (longTrip.Trip_Status === 'Arrived') {
                                          return (
                                            <Button variant="contained" className="text-black" sx={{ backgroundColor: "yellow", color: "white" }}>
                                              Arrived
                                            </Button>
                                          ); // Custom blue color
                                        } else {
                                          return (
                                            <Button variant="contained" className="text-white" sx={{ backgroundColor: "red", color: "white" }}>
                                              Stopped
                                            </Button>
                                          ); // Custom red color
                                        }
                                      })(),
                                    TripType: <h5>Long Distance</h5>,
                                    StartRide: longTrip.curruntLocation,
                                    EndRide: longTrip.finalDestination,
                                });
                            }

                            // Combine Short Distance Trips
                            // for (const shortKey in ShortDistance_Escort) {
                            //   const shortTrip = ShortDistance_Escort[shortKey];
                            //   const stops = shortTrip.stops;

                            //       let showStopLatitude;
                            //       let showStopLongitude;

                            //       for (const key in stops) {
                            //         if (stops.hasOwnProperty(key)) {
                            //           const stop = stops[key];

                            //           showStopLatitude = stop.stopLatitude;
                            //           showStopLongitude = stop.stopLongitude;
                            //           // lastStops.push({"stopLatitude":stop.stopLatitude,"stopLongitude":stop.stopLongitude});
                            //           console.log("Stop latitude:", stop.stopLatitude);
                            //           console.log("Stop longitude:", stop.stopLongitude);
                            //         }
                            //       }    

                            //      console.log("showStopLatitude",showStopLatitude);
                            //      console.log("showStopLongitude",showStopLongitude);





                            //   index += 1;
                            //   newRows.push({
                            //     Sr: index,
                            //     Name: user.userName,
                            //     VehicleReg: shortTrip.vehicleReg,
                            //     VehicleImage: (
                            //       <img
                            //         onClick={() => handleImageClick(shortTrip.imgVehicle)}
                            //         src={shortTrip.imgVehicle}
                            //         alt="vehicle"
                            //         style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            //       />
                            //     ),
                            //     TripDate: shortTrip.ArrivalDate,
                            //     IsMoving: shortTrip.IsMoving ? "Running" : "Arrived",
                            //     TripTime : shortTrip.TripTime,
                            //     TripType: <h5>Short Distance</h5>,
                            //     StartRide: (
                            //       <Link to={`/locateSos/${shortTrip.LiveLatitude}/${shortTrip.LiveLongitude}`}>
                            //         Track
                            //       </Link>
                            //     ),
                            //     EndRide: (
                            //       <Link to={`/locateSos/${showStopLatitude}/${showStopLongitude}`}>
                            //         Track
                            //       </Link>
                            //     ),
                            //   });
                            // }
                        }
                    }
                }

                setRows(newRows); // Set the combined data for both short and long trips
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/authentication/sign-in");
        }
        getData();
    }, [allData]);

    useEffect(() => {
        if (searchTxt == "") {
            getData();
        }

        if (searchTxt) {
            const filteredRows = rows.filter((row) => {
                const { Phone, Name } = row;
                const searchWithoutPlus = searchTxt.replace(/\+/g, ""); // Remove plus sign
                const phoneWithoutPlus = Phone?.replace(/\+/g, ""); // Remove plus sign

                return (
                    phoneWithoutPlus?.startsWith(searchWithoutPlus) ||
                    Name?.toLowerCase().startsWith(searchWithoutPlus.toLowerCase())
                );
            });

            setRows(filteredRows);
        }
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
                                justifyContent: "center", // Ensure horizontal centering
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
                                            Long Distance Escort
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

export default LongDistance;
