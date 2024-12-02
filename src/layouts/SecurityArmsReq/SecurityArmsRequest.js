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

import { ToastContainer, toast } from "react-toastify";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
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
import { showStyledToast } from "components/toastAlert";

import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { VIEWPORT } from "stylis";
import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function SecurityArmsReq() {
  const [rows, setRows] = useState([]);
  const allData = useSelector((state) => state.data.allData);
  const [searchTxt, setSearchText] = useState("");
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [processedSosIds, setProcessedSosIds] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const [openWellBeingMod, setWellBeingMod] = useState(false);

  const [modData, setModData] = useState([]);

  const closeModal = useCallback(
    (index) => {
      setWellBeingMod(false);
    },
    [openWellBeingMod]
  );

  const { loggedIn } = controller;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
  }, []);

  //   const { columns } = authorsTableData();
  const commonHeaderStyle = { color: "blue" }; // Adjust the color as needed

  const columns = [
    {
      Header: <span style={commonHeaderStyle}>Sr</span>,
      accessor: "Sr",
      width: "5%",
      align: "left",
    },
    {
      Header: <span style={commonHeaderStyle}>Name</span>,
      accessor: "Name",
      width: "10%",
      align: "left",
    },
    {
      Header: <span style={commonHeaderStyle}>Image</span>,
      accessor: "userImage",
      width: "10%",
      align: "left",
    },
    { Header: <span style={commonHeaderStyle}>Phone</span>, accessor: "Phone", align: "center" },
    {
      Header: <span style={commonHeaderStyle}>Car Rental</span>,
      accessor: "CarRental",
      align: "center",
    },
    {
      Header: <span style={commonHeaderStyle}>Destination</span>,
      accessor: "DesLoc",
      align: "center",
    },
    {
      Header: <span style={commonHeaderStyle}>Pick Up Location</span>,
      accessor: "PickUpLooc",
      align: "center",
    },
    {
      Header: <span style={commonHeaderStyle}>Requests Days</span>,
      accessor: "RequestedDays",
      align: "center",
    },
    {
      Header: <span style={commonHeaderStyle}>Requests Men</span>,
      accessor: "RequstedMen",
      align: "center",
    },
    {
      Header: <span style={commonHeaderStyle}>Security Network</span>,
      accessor: "SecurityNetwork",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Delete</span>,
      accessor: "Delete",
      align: "center",
    },

    {
      Header: <span style={commonHeaderStyle}>Total Charges</span>,
      accessor: "TotoalCharges",
      align: "center",
    },
  ];

  const deleteItem = async (userId, Id) => {
    // console.log(item , Id );

    const db = getDatabase();
    const usersRef = ref(db, `users/${userId}/Scurity_agent_requests/${Id}`);

    try {
      // Remove the SOS item from the database
      await remove(usersRef);
      console.log("Virtual guard item deleted successfully");
      getUsersAndAttachScurity_agent_requests();
      // Call getSos after the deletion is completed
      // getWellBeingServices();
    } catch (error) {
      console.error("Error deleting virtual guard  item:", error);
    }
  };

  const getUsersAndAttachScurity_agent_requests = useCallback(() => {
    setLoading(true);

    const db = getDatabase();
    const usersRef = ref(db, "users");

    // Wrap the asynchronous logic inside a synchronous function
    const fetchData = async () => {
      try {
        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city

        let i = 0;

        const snapshot = await get(usersRef);

        setRows([]);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersWithScurity_agent_requests = [];

          for (const userId in usersData) {
            if (Object.hasOwnProperty.call(usersData, userId)) {
              const user = usersData[userId];

              // Check if the user has Scurity_agent_requests
              if (user.Scurity_agent_requests) {
                console.log(
                  "Scurity_agent_requests---->>" + JSON.stringify(user.Scurity_agent_requests)
                );

                if (
                  user.userState &&
                  (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
                ) {
                  const Scurity_agent_requestsData = user.Scurity_agent_requests;

                  for (const Scurity_agent_requestId in Scurity_agent_requestsData) {
                    if (
                      Object.hasOwnProperty.call(
                        Scurity_agent_requestsData,
                        Scurity_agent_requestId
                      )
                    ) {
                      const Scurity_agent_requestItem =
                        Scurity_agent_requestsData[Scurity_agent_requestId];
                      // Attach user data and Scurity_agent_request properties to the same object
                      i = i + 1;
                      const Scurity_agent_requestDataObject = {
                        userId,
                        Sr: i,
                        Phone: user.userPhone,
                        userImage: (
                          <img
                            onClick={() => handleImageClick(user.userImage)}
                            src={user.userImage}
                            alt="Image not exist"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                          />
                        ),
                        Name: user.userName,
                        latitude: user.latitude,
                        longitude: user.longitude,
                        Scurity_agent_requestId,
                        Delete: (
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteItem(userId, Scurity_agent_requestId)}
                          >
                            Delete
                          </button>
                        ),
                        // Include other Scurity_agent_request properties here
                        ...Scurity_agent_requestItem,
                      };
                      usersWithScurity_agent_requests.push(Scurity_agent_requestDataObject);
                    }
                  }
                }
              }
            }
          }

          // Do something with usersWithScurity_agent_requests array (if needed)
          setRows(usersWithScurity_agent_requests);
          console.log(usersWithScurity_agent_requests);
          setLoading(false);
        } else {
          setLoading(false);
          console.log("No users found.");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error);
      }
    };

    // Invoke the synchronous function immediately
    fetchData();
  }, []);

  const acceptWorker = (item, key) => {
    // console.log("itemse", item);
    let data = item;
    data.verified = !data.verified;
    const db = getDatabase();
    set(ref(db, "Operators/" + key), {
      ...data,
    }).then(() => {
      alert("Worker has been approved");
    });
    const interval = setTimeout(() => {
      getData();
    }, 2000);
    return () => clearInterval(interval);
  };

  const getData = async () => {
    setRows([]);
    let index = 0;
    const dataBase = getDatabase();
    const userss = ref(dataBase, "/Operators");
    onValue(userss, (snapShot) => {
      //   console.log("users", snapShot);
      snapShot.forEach((doc) => {
        index = index + 1;
        const item = doc.val();
        console.log(item);
        const key = doc.key;
        console.log("ket", key);
        const rowItem = {
          SR: index,
          Name: item.workerName,
          time: item.data,
          Type: item.workerType,
          Image: (
            <img
              onClick={() => handleImageClick(item.userImage)}
              src={item.workerImage}
              alt="react logo"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ),
          Phone: item.workerPhoneNumber,
          Status: item.verified == true ? "Accepted" : `pending`,
          verify:
            item.verified == false ? (
              <button
                type="button"
                key={item.workerPhoneNumber}
                onClick={(e) => {
                  acceptWorker(item, key);
                }}
                class="btn btn-sm text-light btn-secondary"
              >
                Accept
              </button>
            ) : (
              <button
                type="button"
                key={item.workerPhoneNumber}
                onClick={(e) => {
                  acceptWorker(item, key);
                }}
                class="btn btn-sm text-light btn-success"
              >
                verified
              </button>
            ),
          Delete: (
            <button className="btn btn-danger" onClick={() => deleteItem(item, key)}>
              Delete
            </button>
          ),
          //   employed: item.userImage,
          Location: <Link to={`/locate/${item.key}`}> Track </Link>,
        };
        setRows((curr) => [...curr, rowItem]);
      });
      // console.log("snapshot" , snapShot);
    });
  };
  useEffect(() => {
    if (searchTxt == "") {
      getData();
    }

    if (searchTxt) {
      const filteredRows = rows.filter((row) => {
        console.log("rows ", row);
        const { Phone, Name } = row; // Provide default values for destructuring
        const searchLowerCase = searchTxt.toLowerCase();
        return (
          Phone?.toLowerCase().startsWith(searchLowerCase) ||
          Name?.toLowerCase().startsWith(searchLowerCase)
        );
      });

      setRows(filteredRows);
    }
  }, [searchTxt]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const naivgate = useNavigate();
  let user = localStorage.getItem("user");
  // console.log("storage user >>>>>>>", user);
  // if (!user) {
  // naivgate("/authentication/sign-in");
  // }
  useEffect(() => {
    // getData();
    // listenForNewSosWithNotification()
    getUsersAndAttachScurity_agent_requests();
  }, [allData]);

  // const rows = [
  //   {
  //     Name: "test ",
  //     function: "test ",
  //     status: "test ",
  //     employed: "test ",
  //     action: "test ",
  //   },
  //   {
  //     Name: "test ",
  //     function: "test ",
  //     status: "test ",
  //     employed: "test ",
  //     action: "test ",
  //   },
  //   {
  //     Name: "test ",
  //     function: "test ",
  //     status: "test ",
  //     employed: "test ",
  //     action: "test ",
  //   },
  // ];
  // const { columns: pColumns, rows: pRows } = projectsTableData();

  const onClose = () => {
    setIsModalOpen(false);
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
                      Armed Security Network
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
                    className="col-md-9 col-sm-9 col-lg-6 pb-4"
                    style={{
                      backgroundColor: "white",
                      borderRadius: 20,
                      alignSelf: "center",
                      marginTop: "10%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      height: 320,
                    }}
                  >
                    <div className="row">
                      <div className="col-5 ms-4 mt-4">
                        <p style={{ fontSize: 14 }}>
                          WellBeingCheck Type : Vitual Travel Guards <br />
                          Name : {modData.Name}
                          <br />
                          {modData.currentLocTxt
                            ? " Current Location :" + modData.currentLocTxt
                            : null}
                          {modData.destLocTxt ? "  Destination:" + modData.destLocTxt[0] : null}
                          {modData.transportMode
                            ? "  Tranport Mode :" + modData.transportMode
                            : "Tranport Mode : Own Transport"}
                          <br />
                          Date : {modData.ArrivalDate || modData.TripDate}
                          <br />
                          Time : {modData.ArrivalTime || modData.TripTime}
                          <br />
                          partner Type : {modData.PartenerType}
                          <br />
                          partner Name : {modData.Name}
                          <br />
                          partner Phone Number : {modData.PhoneNumber}
                          <br />
                          Vehicle Number : {modData.VehicleNumber}
                          <br />
                          {modData.currentLocTxt
                            ? "Arrival Station : " + modData.currentLocTxt
                            : null}
                          <br />
                          {modData.destLocTxt ? "Destination : " + modData.destLocTxt[0] : null}
                        </p>
                      </div>

                      <div className="col mt-5 ms-4">
                        {modData.WellBeingTripPic ? (
                          <img
                            src={modData.WellBeingTripPic}
                            style={{ backgroundSize: "cover", borderRadius: 10 }}
                            alt="no image attaiched by user"
                            height={250}
                            width={300}
                          />
                        ) : null}
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

export default SecurityArmsReq;
