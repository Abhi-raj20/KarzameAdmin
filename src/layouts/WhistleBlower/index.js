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
import HomeIcon from "@mui/icons-material/Home";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import WarningIcon from "@mui/icons-material/Warning";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PlaceIcon from "@mui/icons-material/Place";

import ErrorIcon from "@mui/icons-material/Error";

import PersonIcon from "@mui/icons-material/Person"; // Import the user icon

import DriveEtaIcon from "@mui/icons-material/DriveEta"; // Import the car icon

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { collection, getDocs } from "firebase/firestore";
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
import SosSection from "components/SosSection";
import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function WhistleBlower() {
  const [rows, setRows] = useState([]);
  const allData = useSelector((state) => state.data.allData);
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [processedSosIds, setProcessedSosIds] = useState([]);

  const [counts, setCounts] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const [searchTxt, setSearchText] = useState("");

  //   const { columns } = authorsTableData();
  const columns = [
    {
      Header: <span style={{ color: "blue" }}>SR</span>,
      accessor: "sr",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Type</span>,

      accessor: "Type",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Detail</span>,
      accessor: "Detail",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Sender</span>,
      accessor: "userName",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Image</span>,
      accessor: "userImage",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Time Stamp</span>,
      accessor: "time",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Delete</span>,
      accessor: "Delete",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Location</span>,
      accessor: "Location",
      align: "center",
    },
  ];

  const getWhistleBlow = useCallback(() => {
    setLoading(true);
    const db = getDatabase();
    const usersRef = ref(db, "users");

    const fetchData = async () => {
      try {
        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city
        // console.log("Current Admin State:", currentAdminState);

        get(usersRef)
          .then((snapshot) => {
            setRows([]);
            if (snapshot.exists()) {
              const usersData = snapshot.val();
              const usersWithWhistleBlow = [];

              // Loop over the keys of the snapshot
              for (const userId in usersData) {
                if (Object.hasOwnProperty.call(usersData, userId)) {
                  const user = usersData[userId];

                  // Check if the user's state matches the admin's state

                  if (
                    user.userState &&
                    (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
                  ) {
                    const { userImage, latitude, longitude } = user;

                    // Check if the user has a Whistle_Blow collection
                    if (user.Whistle_Blow) {
                      console.log("User State:", user.userState);

                      const whistleBlowData = user.Whistle_Blow;
                      const whistleBlowItems = [];

                      // Loop over the keys of the Whistle_Blow data object
                      for (const whistleBlowId in whistleBlowData) {
                        if (Object.hasOwnProperty.call(whistleBlowData, whistleBlowId)) {
                          var whistleBlowItem = whistleBlowData[whistleBlowId];
                          whistleBlowItems.push({
                            id: whistleBlowId,
                            data: whistleBlowItem,
                          });
                        }
                      }

                      const className = ["btn-danger", "btn-warning", "btn-info", "btn-secondary"];

                      let i = 0;
                      for (const whistleBlowItem of whistleBlowItems) {
                        i++;

                        const randomIndex = Math.floor(Math.random() * className.length);
                        const randomClass = className[randomIndex];

                        const whistleBlowObject = {
                          sr: i,
                          ker: i,
                          Type: (
                            <button className={` btn btn-sm ${randomClass} `}>
                              {whistleBlowItem.data.Type}
                            </button>
                          ),
                          time: whistleBlowItem.data.Date,
                          userName: user.userName,
                          Detail:
                            whistleBlowItem.data.Report !== ""
                              ? whistleBlowItem.data.Report
                              : "Not available",
                          userImage: (
                            <img
                              onClick={() => handleImageClick(userImage)}
                              src={userImage}
                              alt="react logo"
                              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            />
                          ),
                          latitude,
                          longitude,
                          Delete: (
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteItem(userId, whistleBlowItem.data.key)}
                            >
                              Delete
                            </button>
                          ),
                          Location: (
                            <button
                              onClick={() => {
                                navigate(
                                  `/LocateSos/${whistleBlowItem.data.Latitude}/${whistleBlowItem.data.Longitude}`
                                );
                              }}
                              className="btn btn-danger btn-sm"
                            >
                              Track
                            </button>
                          ),
                          whistleBlow: whistleBlowItem.data,
                        };

                        usersWithWhistleBlow.push(whistleBlowObject);
                      }
                    }
                  }
                }
              }

              usersWithWhistleBlow.sort((a, b) => {
                const dateA = new Date(a.time.split(" - ")[1] + " " + a.time.split(" - ")[0]);
                const dateB = new Date(b.time.split(" - ")[1] + " " + b.time.split(" - ")[0]);
                return dateB - dateA;
              });

              const typeInfo = {};

              for (const whistleBlowObject of usersWithWhistleBlow) {
                const type = whistleBlowObject.Type.props.children;
                if (typeInfo[type]) {
                  typeInfo[type].count++;
                } else {
                  typeInfo[type] = { count: 1, percentage: 0 };
                }
              }

              const totalCount = usersWithWhistleBlow.length;
              for (const type in typeInfo) {
                const count = typeInfo[type].count;
                const percentage = (count / totalCount) * 100;
                typeInfo[type].percentage = Math.floor(percentage);
              }

              setCounts(typeInfo);
              console.log("typeInfo-->" + typeInfo);
              setRows(usersWithWhistleBlow);
              console.log("usersWithWhistleBlow-->" + usersWithWhistleBlow);
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
  }, [allData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true when fetching data
      try {
        const db = getDatabase();
        const usersRef = ref(db, "users");
        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

        get(usersRef)
          .then((snapshot) => {
            setRows([]);
            if (snapshot.exists()) {
              const usersData = snapshot.val();
              const usersWithWhistleBlow = [];

              // Loop over the keys of the snapshot
              for (const userId in usersData) {
                if (Object.hasOwnProperty.call(usersData, userId)) {
                  const user = usersData[userId];
                  const { userImage, latitude, longitude } = user;

                  // Check if the user state matches the current admin state
                  if (
                    user.userState &&
                    (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
                  ) {
                    // Check if the user has a Whistle_Blow collection
                    if (user.Whistle_Blow) {
                      const whistleBlowData = user.Whistle_Blow;

                      // Create an array to store the whistleBlowItems
                      const whistleBlowItems = [];

                      // Loop over the keys of the Whistle_Blow data object
                      for (const whistleBlowId in whistleBlowData) {
                        if (Object.hasOwnProperty.call(whistleBlowData, whistleBlowId)) {
                          const whistleBlowItem = whistleBlowData[whistleBlowId];
                          whistleBlowItems.push({
                            id: whistleBlowId, 
                            data: whistleBlowItem,
                          });
                        } 
                      }

                      // Sort whistleBlowItems array based on date (assuming 'Date' field exists in whistleBlowItem)
                      // whistleBlowItems.sort((a, b) => {
                      //   const partsA = a.data.Date.split(' - ');
                      //   const partsB = b.data.Date.split(' - ');

                      //   const timeA = partsA[0];
                      //   const dateA = partsA[1];

                      //   const timeB = partsB[0]; 
                      //   const dateB = partsB[1];

                      //   const dateTimeA = new Date(dateA + ' ' + timeA);
                      //   const dateTimeB = new Date(dateB + ' ' + timeB);

                      //   return dateTimeB - dateTimeA;
                      // });
                      const className = ["btn-danger", "btn-warning", "btn-info", "btn-secondary"];

                      // Loop through sorted whistleBlowItems
                      let i = 0;
                      for (const whistleBlowItem of whistleBlowItems) {
                        i++;

                        const randomIndex = Math.floor(Math.random() * className.length);
                        const randomClass = className[randomIndex];

                        // Create a Whistle_Blow object and add it to the array
                        const whistleBlowObject = {
                          sr: i,
                          ker: i,
                          Type: (
                            <button className={` btn btn-sm ${randomClass} `}>
                              {whistleBlowItem.data.Type}
                            </button>
                          ),
                          time: whistleBlowItem.data.Date,
                          userName: user.userName,
                          Detail:
                            whistleBlowItem.data.Report !== ""
                              ? whistleBlowItem.data.Report
                              : "Not available",
                          userImage: (
                            <img
                              onClick={() => handleImageClick(userImage)}
                              src={userImage}
                              alt="react logo"
                              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            />
                          ),
                          Delete: (
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteItem(userId, whistleBlowItem.data.key)}
                            >
                              Delete
                            </button>
                          ),
                          latitude,
                          longitude,
                          Location: <Link to={`/locate/${userId}`}> Track </Link>,
                          whistleBlow: whistleBlowItem.data,
                        };

                        usersWithWhistleBlow.push(whistleBlowObject);
                      }
                    }
                  }
                }
              }

              usersWithWhistleBlow.sort((a, b) => {
                const dateA = new Date(a.time.split(" - ")[1] + " " + a.time.split(" - ")[0]);
                const dateB = new Date(b.time.split(" - ")[1] + " " + b.time.split(" - ")[0]);
                return dateB - dateA;
              });

              if (search !== "All") {
                const filteredUsersWithWhistleBlow = usersWithWhistleBlow.filter(
                  (item) => item.whistleBlow.Type === search
                );
                setRows(filteredUsersWithWhistleBlow);
              } else {
                setRows(usersWithWhistleBlow);
              }

              // Do something with usersWithWhistleBlow array (if needed)
              // console.log(usersWithWhistleBlow);
            } else {
              console.log("No users found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          })
          .finally(() => {
            setLoading(false); // Set loading state to false after fetching data
          });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [search, allData]);

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
          Location: <Link to={`/locate/${item.key}`}> Track </Link>,
        };
        setRows((curr) => [...curr, rowItem]);
      });
      // console.log("snapshot" , snapShot);
    });
    return;
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
    getWhistleBlow();
  }, [allData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    if (searchTxt == "") {
      getWhistleBlow();
    }

    if (searchTxt) {
      const filteredRows = rows.filter((row) => {
        console.log("rows ", row);
        const { userName } = row; // Provide default values for destructuring
        const searchLowerCase = searchTxt.toLowerCase();
        return userName.toLowerCase().startsWith(searchLowerCase);
      });

      setRows(filteredRows);
    }
  }, [searchTxt]);

  const deleteItem = async (userId, Id) => {
    // alert(userId + "<----->" + Id);
    const db = getDatabase();
    const usersRef = ref(db, `users/${userId}/Whistle_Blow/${Id}`);

    try {
      // Remove the SOS item from the database
      await remove(usersRef);
      console.log("Virtual guard item deleted successfully");

      // Call getSos after the deletion is completed
      getWhistleBlow();
    } catch (error) {
      console.error("Error deleting virtual guard  item:", error);
    }
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
              <div className="container row ms-4 mb-1">
                <div className="col-sm col-lg col-xl mt-2">
                  <SosSection
                    OnPress={() => setSearch("Record transport ID")}
                    count={counts["Record transport ID"] ? counts["Record transport ID"].count : 0}
                    per={
                      counts["Record transport ID"] ? counts["Record transport ID"].percentage : 0
                    }
                    color="#279858"
                    icon={<DriveEtaIcon style={{ color: "white" }} />}
                    title="Record transport ID"
                  />
                </div>

                <div className="col-sm col-lg col-xl mt-2">
                  <SosSection
                    OnPress={() => setSearch("Robbery")}
                    count={counts["Robbery"] ? counts["Robbery"].count : 0}
                    per={counts["Robbery"] ? counts["Robbery"].percentage : 0}
                    color="#B9472C"
                    icon={<DriveEtaIcon style={{ color: "white" }} />}
                    title="Robbery"
                  />
                </div>

                <div className="col-sm col-lg col-xl mt-2">
                  <SosSection
                    OnPress={() => setSearch("Vandalism")}
                    count={counts["Vandalism"] ? counts["Vandalism"].count : 0}
                    per={counts["Vandalism"] ? counts["Vandalism"].percentage : 0}
                    color="#e65555"
                    icon={<DriveEtaIcon style={{ color: "white" }} />}
                    title="Vandalism"
                  />
                </div>

                <div className="col-sm col-lg col-xl mt-2">
                  <SosSection
                    OnPress={() => setSearch("Snatched Car")}
                    count={counts["Snatched Car"] ? counts["Snatched Car"].count : 0}
                    per={counts["Snatched Car"] ? counts["Snatched Car"].percentage : 0}
                    color="#CA1DAE"
                    icon={<DriveEtaIcon style={{ color: "white" }} />}
                    title="Snatched Car"
                  />
                </div>

                <div className="col-sm col-lg col-xl mt-2">
                  <SosSection
                    OnPress={() => setSearch("Armed Robbers in my compound")}
                    count={
                      counts["Armed Robbers in my compound"]
                        ? counts["Armed Robbers in my compound"].count
                        : 0
                    }
                    per={
                      counts["Armed Robbers in my compound"]
                        ? counts["Armed Robbers in my compound"].percentage
                        : 0
                    }
                    color="#e65555"
                    icon={<DriveEtaIcon style={{ color: "white" }} />}
                    title="Armed Robbers in my compound"
                  />
                </div>

                {/* <div className="col-sm col-lg col-xl mt-2">
              <SosSection
                OnPress={() => setSearch("Report kidnapping")}
                count={counts["Report kidnapping"] ? counts["Report kidnapping"].count : 0}
                per={counts["Report kidnapping"] ? counts["Report kidnapping"].percentage : 0}
                color="#279858"
                icon={<PersonIcon style={{ color: "white" }} />}
                title="Report kidnapping"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2">
              <SosSection
                OnPress={() => setSearch("Search a house")}
                count={counts["Search a house"] ? counts["Search a house"].count : 0}
                per={counts["Search a house"] ? counts["Search a house"].percentage : 0}
                color="#9D56E0"
                icon={<HomeIcon style={{ color: "white" }} />}
                title="Search a House"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2">
              <SosSection
                OnPress={() => setSearch("Stop ritual killing")}
                count={counts["Stop ritual killing"] ? counts["Stop ritual killing"].count : 0}
                per={counts["Stop ritual killing"] ? counts["Stop ritual killing"].percentage : 0}
                color="#9D56E0"
                icon={<ErrorIcon style={{ color: "white" }} />}
                title=" Ritual Killing"
              />
            </div>

            <div className="col-sm col-lg col-xl mt-2">
              <SosSection
                OnPress={() => setSearch("Report a criminal in your area")}
                count={
                  counts["Report a criminal in your area"]
                    ? counts["Report a criminal in your area"].count
                    : 0
                }
                per={
                  counts["Report a criminal in your area"]
                    ? counts["Report a criminal in your area"].percentage
                    : 0
                }
                color="#B9472C"
                icon={<PlaceIcon style={{ color: "white" }} />}
                title="Criminal In Area"
              />
            </div>
            <div className="col-sm col-lg col-xl mt-2">
              <SosSection
                OnPress={() => setSearch("Others")}
                count={counts["Others"] ? counts["Others"].count : 0}
                per={counts["Others"] ? counts["Others"].percentage : 0}
                color="#3583ED"
                icon={<HelpOutlineIcon style={{ color: "white" }} />}
                title="Others"
              />
            </div> */}
                <div className="col-sm col-lg col-xl mt-2">
                  <SosSection
                    OnPress={() => setSearch("All")}
                    count={rows ? rows.length : 0}
                    color="#CA1DAE"
                    icon={<WarningIcon style={{ color: "white" }} />}
                    title="All"
                  />
                </div>
                <div className="col-sm col-lg col-xl mt-2">
                  {/* <SosSection
                OnPress={() => setSearch('All')}
                count={rows ? rows.length : 0}
                color="#CA1DAE"
                icon={<WarningIcon style={{ color: "white" }}
                />}
                title="All"
              /> */}
                </div>
              </div>
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
                      Dashboard
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
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default WhistleBlower;
