// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import VisibilityIcon from "@mui/icons-material/Visibility";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate } from "react-router-dom";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { ToastContainer, toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  onChildAdded,
  child,
  update,
  onChildChanged,
  remove,
} from "firebase/database";
import { collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { Box, Button, ListItem, Modal } from "@mui/material";
import { object } from "prop-types";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";
import CountdownRow from "components/CounDown";
import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function VirtualHomeCheck() {
  const [rows, setRows] = useState([]);
  const allData = useSelector((state) => state.data.allData);

  const [searchTxt, setSearchText] = useState("");
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const [loading, setLoading] = useState(false);
  const [openWellBeingMod, setWellBeingMod] = useState(false);

  const [modData, setModData] = useState([]);

  const closeModal = useCallback(
    (index) => {
      setWellBeingMod(false);
    },
    [openWellBeingMod]
  );

  const [processedSosIds, setProcessedSosIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const { loggedIn } = controller;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
  }, []);

  function addMinutesToTime(inputTime, minutesToAdd) {
    // Step 1: Parse the input time
    const timeComponents = inputTime.match(/^(\d{1,2}):(\d{2})\s?([APap][Mm])$/);
    if (!timeComponents) {
      throw new Error("Invalid time format. Please use 'hh:mm AM/PM' format.");
    }

    let [, hours, minutes, amPm] = timeComponents;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (amPm.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    } else if (amPm.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    // Step 2: Create a Date object and add minutes
    const parsedTime = new Date();
    parsedTime.setHours(hours, minutes);
    parsedTime.setMinutes(parsedTime.getMinutes() + minutesToAdd);

    // Step 3: Format the result
    const formattedHours = parsedTime.getHours() % 12 || 12;
    const formattedMinutes = parsedTime.getMinutes();
    const formattedAmPm = parsedTime.getHours() >= 12 ? "PM" : "AM";

    return `${formattedHours}:${String(formattedMinutes).padStart(2, "0")} ${formattedAmPm}`;
  }

  //   const { columns } = authorsTableData();
  const columns = [
    { Header: <span style={{ color: "blue" }}>SR</span>, accessor: "SR", align: "center" },
    // { Header: <span style={{ color: 'blue' }}>Type</span>, accessor: "Type", align: "center" },
    // { Header: <span style={{ color: 'blue' }}>Sender</span>, accessor: "userName", align: "center" },
    {
      Header: <span style={{ color: "blue" }}>Selfie</span>,
      accessor: "userImage",
      align: "center",
    },
    { Header: <span style={{ color: "blue" }}>Date</span>, accessor: "Date", align: "center" },
    {
      Header: <span style={{ color: "blue" }}>Interval</span>,
      accessor: "interval",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Start Time</span>,
      accessor: "time",
      align: "center",
    },
    // { Header: <span style={{ color: 'blue' }}>End Time</span>, accessor: "endtime", align: "center" },
    { Header: <span style={{ color: "blue" }}>count Down</span>, accessor: "cd", align: "center" },
    {
      Header: <span style={{ color: "blue" }}>Location</span>,
      accessor: "Location",
      align: "center",
    },
    { Header: <span style={{ color: "blue" }}>View</span>, accessor: "Action", align: "center" },
    {
      Header: <span style={{ color: "blue" }}>Selfie/Location Id</span>,
      accessor: "selVeh",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Delete</span>,
      accessor: "Delete",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Map Location</span>,
      accessor: "map",
      align: "center",
    },
  ];

  const deleteItem = async (userId, Id) => {
    // alert(userId + "<----->" + Id);
    const db = getDatabase();
    const usersRef = ref(db, `users/${userId}/VirtualHomeCheck/${Id}`);

    try {
      // Remove the SOS item from the database
      await remove(usersRef);
      console.log("Virtual home check  item deleted successfully");

      // Call getSos after the deletion is completed
      getVirtualHomeCheck();
    } catch (error) {
      console.error("Error deleting virtual home  item:", error);
    }
  };

  const getVirtualHomeCheck = useCallback(() => {
    setLoading(true);
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const fetchData = async () => {
      try {
        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city

        get(usersRef)
          .then((snapshot) => {
            setRows([]);
            if (snapshot.exists()) {
              const usersData = snapshot.val();
              const allVirtualHomeCheckItems = [];

              for (const userId in usersData) {
                if (Object.hasOwnProperty.call(usersData, userId)) {
                  const user = usersData[userId];
                  user.userId = userId;
                  const { userImage, latitude, longitude } = user;
                  let i = 1; // Start with 1 for ascending order of SR

                  if (
                    user.userState &&
                    (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
                    user.VirtualHomeCheck
                  ) {
                    // console.log("users Names-->" + user.userName);
                    // console.log(
                    //   "Homechck-To--->" +
                    //     user.userState.toLowerCase() +
                    //     "Homechck--PO->" +
                    //     currentAdminState.toLowerCase()
                    // );
                    const virtualHomeCheckData = user.VirtualHomeCheck;

                    for (const virtualHomeCheckId in virtualHomeCheckData) {
                      if (Object.hasOwnProperty.call(virtualHomeCheckData, virtualHomeCheckId)) {
                        const virtualHomeCheckItem = virtualHomeCheckData[virtualHomeCheckId];

                        if (Object.keys(virtualHomeCheckItem).length > 0) {
                          const virtualHomeCheckDataObject = {
                            SR: i,
                            Type: "Virtual Home Check",
                            Date: virtualHomeCheckItem.Date,
                            time: virtualHomeCheckItem.Time,
                            cd: (
                              <CountdownRow
                                key={i}
                                date={virtualHomeCheckItem.Date}
                                time={virtualHomeCheckItem.Time}
                                interval={virtualHomeCheckItem.Interval}
                              />
                            ),
                            selVeh: (
                              <>
                                <Button
                                  onClick={() => {
                                    handleImageClick(user.userSelfie);
                                  }}
                                  style={{ padding: 0 }}
                                  className="btn btn-priamry btn-sm p-0 m-0 bg-primary text-light btn-sm"
                                >
                                  Selfie
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleImageClick(user.userVehicle);
                                  }}
                                  style={{ padding: 0 }}
                                  className=" ms-1 btn btn-secondary btn-sm px-1 p-0 m-0 bg-secondary text-warning btn-sm"
                                >
                                  Location Id
                                </Button>
                              </>
                            ),
                            Location: (
                              <h6 className="fw-bold btn btn-sm btn-warning text-dark">
                                {" "}
                                {virtualHomeCheckItem.Place}
                              </h6>
                            ),
                            interval: virtualHomeCheckItem.Interval + " Minutes",
                            Action: (
                              <Button
                                onClick={() => {
                                  setModData(virtualHomeCheckItem);
                                  console.log("mod data ", virtualHomeCheckItem);
                                  setWellBeingMod(true);
                                }}
                                style={{ padding: 7, backgroundColor: "#f2f2f2" }}
                              >
                                <VisibilityIcon />
                              </Button>
                            ),
                            Delete: (
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteItem(userId, virtualHomeCheckItem.key)}
                              >
                                Delete
                              </button>
                            ),
                            userImage: (
                              <img
                                onClick={() => handleImageClick(virtualHomeCheckItem.userSelfie)}
                                src={virtualHomeCheckItem.userSelfie}
                                alt="No picture"
                                style={{
                                  backgroundSize: "cover",
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                }}
                              />
                            ),
                            map: <Link to={`/locate/${userId}?userData=truck`}>Track</Link>,
                          };

                          allVirtualHomeCheckItems.push(virtualHomeCheckDataObject);
                          i++;
                        }
                      }
                    }
                  }
                }
              }

              // Sort the array by SR in ascending order
              allVirtualHomeCheckItems.sort((a, b) => a.SR - b.SR);

              setRows(allVirtualHomeCheckItems.reverse());
              setLoading(false);
            } else {
              setLoading(false);
              console.log("No users found.");
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error fetching users:", error);
          });
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const naivgate = useNavigate();
  let user = localStorage.getItem("user");

  useEffect(() => {
    // getData();
    // listenForNewSosWithNotification()
    getVirtualHomeCheck();
  }, [allData]);

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar value={searchTxt} onChange={handleSearchChange} />
      <ToastContainer />
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
                    <MDTypography variant="h6" color="white">
                      Virtual Home Check
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
                <Modal
                  open={openWellBeingMod}
                  // className="position-relative"
                  style={{ borderRadius: 5 }}
                  onClose={() => setWellBeingMod(false)}
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
                      height: 230,
                    }}
                  >
                    <div className="row">
                      <div className="col-6 ms-4 mt-4">
                        <p>
                          Type : {"Virrtual Home Check"}
                          <br />
                          Date : {modData.Date}
                          <br />
                          Time : {modData.Time}
                          <br />
                          Interval : {modData.Interval}
                          <br />
                          Location : {modData.Place}
                        </p>
                      </div>

                      <div className="col mt-2">
                        <img
                          style={{ backgroundSize: "cover" }}
                          alt="no image attaiched by user"
                          height={200}
                          width={200}
                          src={modData.userSelfie}
                        />
                      </div>
                    </div>
                  </Box>
                </Modal>
              </Grid>
            </>
          )}
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default VirtualHomeCheck;
