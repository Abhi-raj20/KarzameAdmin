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
import "react-toastify/dist/ReactToastify.css";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
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
import { Box, Modal } from "@mui/material";
import { object } from "prop-types";
import ImageModal from "components/ImageModal";
import TriggerModal from "components/TriggerModal";
import { getCurrentAdminState } from "Utils/Functions";
import { async } from "@firebase/util";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function Batterylevels() {
  const [rows, setRows] = useState([]);
  const allData = useSelector((state) => state.data.allData);

  const [searchTxt, setSearchText] = useState("");
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [processedSosIds, setProcessedSosIds] = useState([]);
  const [triggerModal, setTriggerModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [onClickImageData, setOnClickImageData] = useState("");

  const [triggerModalData, setTriggerModalData] = useState(null); // State to hold data for TriggerModal

  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const onCloseTrigger = () => {
    setTriggerModal(false);
  };

  const handleSee = (user, sosItem) => {
    setTriggerModalData({ user, sosItem }); // Pass both user and sosItem data to the TriggerModal
    setTriggerModal(true);
  };

  const { loggedIn } = controller;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
  }, []);

  //   const { columns } = authorsTableData();
  const columns = [
    { Header: <span style={{ color: "blue" }}>SR</span>, accessor: "sr", align: "left" },
    { Header: <span style={{ color: "blue" }}>Sender</span>, accessor: "userName", align: "left" },

    { Header: <span style={{ color: "blue" }}>Image</span>, accessor: "userImage", align: "left" },
    {
      Header: (
        <h6 className="text-warning btn-dark btn pt-0 pb-0" style={{ color: "blue" }}>
          {" "}
          Plan{" "}
        </h6>
      ),
      accessor: "subscription",
      align: "center",
    },
    // { Header: <span style={{ color: 'blue' }}>Time Of SOS</span>, accessor: "time", align: "center" },
    { Header: <span style={{ color: "blue" }}>Email</span>, accessor: "userEmail", align: "left" },
    {
      Header: <span style={{ color: "blue" }}>Phone</span>,
      accessor: "userPhone",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Delete</span>,
      accessor: "Delete",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Info</span>,
      accessor: "Location",
      align: "center",
    },
  ];

  const deleteSosItem = async (userId, sosId) => {
    console.log(userId, sosId);
    const db = getDatabase();
    const usersRef = ref(db, `users/${userId}/BatteryLevels/${sosId}`);

    try {
      // Remove the SOS item from the database
      await remove(usersRef);
      console.log("SOS item deleted successfully");

      // Call getSos after the deletion is completed
      getBatteryLevels();
    } catch (error) {
      console.error("Error deleting SOS item:", error);
    }
  };

  const getBatteryLevels = async () => {
    setLoading(true);
    const db = getDatabase();
    const usersRef = ref(db, "users");

    const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city

    // Use on method to listen for real-time updates
    onValue(usersRef, (snapshot) => {
      setRows([]);
      if (snapshot.exists()) {
        const usersData = snapshot.val();

        const batteryLevelsItems = Array.from(
          Object.entries(usersData)
            .map(([userId, user]) => {
              if (user && user.BatteryLevels) {
                if (
                  user.userState &&
                  (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
                ) {
                  return Object.entries(user.BatteryLevels).map(([sosId, sosItem]) => {
                    return {
                      userName: user.userName,
                      userEmail: user.userEmail,
                      ...user,
                      sosId: sosId,
                      ...sosItem,
                      userImage: (
                        <img
                          onClick={() => handleImageClick(user.userImage)}
                          src={user.userImage}
                          alt="react logo"
                          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                      ),
                      Location: (
                        <button
                          onClick={() => handleSee(user, sosItem)}
                          className="btn btn-danger btn-sm"
                        >
                          See
                        </button>
                      ),
                      Delete: (
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteSosItem(userId, sosId)}
                        >
                          Delete
                        </button>
                      ),
                      subscription:
                        user.subscription === "Basic" ? (
                          "Basic"
                        ) : user.subscription === "Premium" ? (
                          <h6 className=" btn btn-sm btn-success text-light">
                            {user.subscription}{" "}
                          </h6>
                        ) : (
                          <h6 className="btn btn-sm btn-secondary text-light">
                            {user.subscription}{" "}
                          </h6>
                        ),
                    };
                  });
                }
              }
              return [];
            })
            .flat()
        );

        // Sort the batteryLevelsItems array based on the 'Date' property in descending order
        batteryLevelsItems.sort((a, b) => new Date(b.Date) - new Date(a.Date));

        // Add SR to batteryLevelsItems
        batteryLevelsItems.forEach((sosItem, index) => {
          sosItem.sr = index + 1;
        });

        // Now batteryLevelsItems contains data for all SOS entries sorted by the latest at the top
        console.log("BatteryLevels ", batteryLevelsItems);
        setRows(batteryLevelsItems);
        setLoading(false);
      } else {
        setLoading(false);
        console.log("No users found.");
      }
    });
  };

  const getLatestSOSTimestamp = (user) => {
    const sosData = user.BatteryLevels;
    let latestTimestamp = 0;

    for (const sosId in sosData) {
      if (Object.hasOwnProperty.call(sosData, sosId)) {
        const sosItem = sosData[sosId];
        const sosDateTime = new Date(sosItem.Date);

        if (sosDateTime.getTime() > latestTimestamp) {
          latestTimestamp = sosDateTime.getTime();
        }
      }
    }

    return latestTimestamp;
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
          Location: <Link to={`/locate/${item.key}`}> Track </Link>,
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
    // listenForNewSosWithNotification();
    getBatteryLevels();
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

  useEffect(() => {
    if (searchTxt == "") {
      getBatteryLevels();
      return;
    }

    if (searchTxt) {
      const filteredRows = rows.filter((row) => {
        console.log("rows ", row);
        const { userPhone, userName } = row;
        const searchWithoutPlus = searchTxt.replace(/\+/g, ""); // Remove plus sign
        const phoneWithoutPlus = userPhone?.replace(/\+/g, ""); // Remove plus sign

        return (
          phoneWithoutPlus?.startsWith(searchWithoutPlus) ||
          userName?.toLowerCase().startsWith(searchWithoutPlus.toLowerCase())
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
                      Virtual Guard Alert Low Battery
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

                <TriggerModal
                  icon={false}
                  onCloseTrigger={onCloseTrigger}
                  triggerModal={triggerModal}
                  triggerModalData={triggerModalData}
                  triggerTitle={"Virtual Guard Alert Low Battery"}
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

export default Batterylevels;
