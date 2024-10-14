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
function Wellbeing_Managment() {
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

  const columns = [
    { Header: <span style={{ color: "blue" }}>SR</span>, accessor: "sr", align: "center" },
    {
      Header: (
        <span className="text-danger h6" style={{ fontWeight: "bolder" }}>
          {" "}
          Selfie/Vehicle
        </span>
      ),
      accessor: "userImage",
      align: "center",
    },
    { Header: <span style={{ color: "blue" }}>Origin</span>, accessor: "origin", align: "center" },
    {
      Header: <span style={{ color: "blue" }}>Destination</span>,
      accessor: "dest",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Transport Mode</span>,
      accessor: "transMode",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Partner Type</span>,
      accessor: "partner",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Partner Name</span>,
      accessor: "partnerName",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Partner Contact</span>,
      accessor: "partnerCont",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Arrival Date</span>,
      accessor: "Date",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Arrival Time</span>,
      accessor: "time",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Vehicle Number</span>,
      accessor: "No",
      align: "center",
    },

    {
      Header: <span style={{ color: "blue" }}>Delete</span>,
      accessor: "Delete",
      align: "center",
    },

    { Header: <span style={{ color: "blue" }}>View</span>, accessor: "Action", align: "center" },
    { Header: <span style={{ color: "blue" }}>Map</span>, accessor: "Location", align: "center" },
  ];

  const deleteItem = async (userId, Id) => {
    // alert(userId + "<----->" + Id);
    const db = getDatabase();
    const usersRef = ref(db, `users/${userId}/wellBeingServicesData/${Id}`);

    try {
      // Remove the SOS item from the database
      await remove(usersRef);
      console.log("Virtual guard item deleted successfully");

      // Call getSos after the deletion is completed
      getWellBeingServices();
    } catch (error) {
      console.error("Error deleting virtual guard  item:", error);
    }
  };

  const getWellBeingServices = useCallback(() => {
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
              const usersWithWellBeingServices = [];

              // Loop over the keys of the snapshot
              for (const userId in usersData) {
                if (Object.hasOwnProperty.call(usersData, userId)) {
                  const user = usersData[userId];
                  const { userImage, latitude, longitude } = user;

                  // Check if the user has a wellBeingServicesData collection

                  if (
                    user.userState &&
                    (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
                    user.wellBeingServicesData
                  ) {
                    const wellBeingData = user.wellBeingServicesData;

                    // Create an array to store the wellBeingServiceItems
                    const wellBeingServiceItems = [];

                    // Loop over the keys of the wellBeingServicesData object
                    for (const wellBeingServiceId in wellBeingData) {
                      if (Object.hasOwnProperty.call(wellBeingData, wellBeingServiceId)) {
                        const wellBeingServiceItem = wellBeingData[wellBeingServiceId];
                        wellBeingServiceItems.push({
                          id: wellBeingServiceId,
                          data: wellBeingServiceItem,
                        });
                      }
                    }

                    // Loop through sorted wellBeingServiceItems
                    let i = 0;
                    for (const wellBeingServiceItem of wellBeingServiceItems) {
                      console.log("item of well being check", wellBeingServiceItem);

                      i++;

                      // Create a wellBeingServicesData object and add it to the array
                      const wellBeingServicesDataObject = {
                        sr: i,
                        ker: i,
                        Type: (
                          <button className={` btn btn-sm`}>
                            {wellBeingServiceItem.data.Type}
                          </button>
                        ),
                        Date: wellBeingServiceItem.data.ArrivalDate,
                        selVeh: (
                          <>
                            <Button
                              onClick={() => {
                                handleImageClick(wellBeingServiceItem.data.WellBeingTripPic);
                              }}
                              style={{ padding: 0 }}
                              className="btn btn-priamry btn-sm p-0 m-0 bg-primary text-light btn-sm  "
                            >
                              Vehicle
                            </Button>
                            <Button
                              style={{ padding: 0 }}
                              className=" ms-1 btn btn-secondary btn-sm p-0 m-0 bg-secondary  text-light btn-sm  "
                            >
                              Selfien
                            </Button>
                          </>
                        ),
                        partnerCont:
                          wellBeingServiceItem.data.PhoneNumber !== ""
                            ? wellBeingServiceItem.data.PhoneNumber
                            : "Not available",
                        origin: wellBeingServiceItem.data.currentLocTxt,
                        dest: wellBeingServiceItem.data.destLocTxt,
                        time: wellBeingServiceItem.data.ArrivalTime,
                        partnerName:
                          wellBeingServiceItem.data.Name !== ""
                            ? wellBeingServiceItem.data.Name
                            : "Not available",
                        transMode: wellBeingServiceItem.data.TransportType
                          ? wellBeingServiceItem.data.TransportType
                          : wellBeingServiceItem.data.ArrivalStation
                          ? "Train"
                          : "Own",

                        No: wellBeingServiceItem.data.VehicleNumber,
                        partner: wellBeingServiceItem.data.PartenerType,
                        userImage: (
                          <img
                            onClick={() =>
                              handleImageClick(wellBeingServiceItem.data.WellBeingTripPic)
                            }
                            src={wellBeingServiceItem.data.WellBeingTripPic}
                            alt=" No image added"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                          />
                        ),

                        Delete: (
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteItem(userId, wellBeingServiceItem.data.key)}
                          >
                            Delete
                          </button>
                        ),
                        Action: (
                          <Button
                            onClick={() => {
                              console.log("wellbeing", wellBeingServiceItem.data);
                              setModData(wellBeingServiceItem.data);
                              setWellBeingMod(true);
                            }}
                            style={{ padding: 4, backgroundColor: "#f2f2f2" }}
                          >
                            <VisibilityIcon />
                          </Button>
                        ),
                        latitude,
                        longitude,

                        Location: <Link to={`/locate/${userId}?userData=truck`}>Track</Link>,
                        wellBeingService: wellBeingServiceItem.data,
                      };
                      usersWithWellBeingServices.push(wellBeingServicesDataObject);
                    }
                  }
                }
              }

              usersWithWellBeingServices.sort((a, b) => a.sr - b.sr);

              // Do something with usersWithWellBeingServices array (if needed)
              setRows(usersWithWellBeingServices.reverse());
              console.log(usersWithWellBeingServices);
              setLoading(false);
            } else {
              setLoading(false);
              console.log("No users found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const deleteAllRows = () => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();

          for (const userId in usersData) {
            if (Object.hasOwnProperty.call(usersData, userId)) {
              const user = usersData[userId];

              // Check if the user has a wellBeingServicesData collection
              if (user.wellBeingServicesData) {
                // Remove the wellBeingServicesData collection from the user
                update(ref(usersRef, `${userId}/wellBeingServicesData`), null)
                  .then(() => {
                    console.log(`Deleted wellBeingServicesData for user with ID: ${userId}`);
                  })
                  .catch((error) => {
                    console.error(
                      `Error deleting wellBeingServicesData for user with ID: ${userId}`,
                      error
                    );
                  });
              }
            }
          }

          console.log("All rows deleted.");
        } else {
          console.log("No users found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

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
          //   employed: item.userImage,

          Location: <Link to={`/locate/${item.key}?userData=truck`}>Track</Link>,
        };
        setRows((curr) => [...curr, rowItem]);
      });
      // console.log("snapshot" , snapShot);
    });
    return;
    const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach((doc) => {
      console.log("Users data ", doc);
    });
    const arr = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      console.log("user data >>>", item);
      arr.push({
        Name: item.name,
        Email: item.email,
        Image: (
          <img
            src={item.userImage}
            alt="react logo"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        Phone: item.phoneNumber,
        Gender: item.gender,
        status: item.userEmail,
        employed: item.userImage,
        action: <Link to={`/locate/${item.key}`}> Track </Link>,
      });
    });
    setRows(arr);
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
    getWellBeingServices();
    // deleteAllRows()
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
                      Virtual Travel Guard
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

export default Wellbeing_Managment;
