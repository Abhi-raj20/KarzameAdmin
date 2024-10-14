// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link, useNavigate, useParams } from "react-router-dom";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

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
} from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { Box, ListItem, Modal } from "@mui/material";
import { object } from "prop-types";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";
import ImageModal from "components/ImageModal";
import EmptyData from "components/EmptyData";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function WhistleBlowSingleUser() {
  const [rows, setRows] = useState([]);
  const { userId, whistleBlowId } = useParams();

  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [processedSosIds, setProcessedSosIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  //   const { columns } = authorsTableData();
  const columns = [
    { Header: "SR", accessor: "sr", align: "left" },
    { Header: "Type", accessor: "Type", align: "left" },
    { Header: "Sender", accessor: "userName", align: "left" },
    { Header: "Image", accessor: "userImage", align: "left" },
    { Header: "Time Stamp", accessor: "time", align: "center" },
    { Header: "Location", accessor: "Location", align: "center" },
  ];

  const getWhistleBlow = useCallback(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}/Whistle_Blow/${whistleBlowId}`); // Use the provided userId and whistleBlowId

    get(userRef)
      .then((snapshot) => {
        setRows([]);
        if (snapshot.exists()) {
          const whistleBlowItem = snapshot.val();
          const { userImage, latitude, longitude } = whistleBlowItem; // Assuming whistle blow data has userImage, latitude, and longitude

          const usersWithWhistleBlow = [];

          const className = ["btn-danger", "btn-warning", "btn-info", "btn-secondary"];

          // Create a Whistle_Blow object for the single item
          const whistleBlowObject = {
            sr: 1, // Assuming this is the first row
            ker: 1, // Assuming this is the first row
            Type: <button className={`btn btn-sm ${className[0]}`}>{whistleBlowItem.Type}</button>,
            time: whistleBlowItem.Date,
            userName: whistleBlowItem.userName,
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
            Location: <Link to={`/locate/${userId}`}> Track </Link>,
            whistleBlow: whistleBlowItem,
          };

          usersWithWhistleBlow.push(whistleBlowObject);

          // Do something with usersWithWhistleBlow array (if needed)
          setRows(usersWithWhistleBlow);
          console.log(usersWithWhistleBlow);
        } else {
          console.log(`Whistle Blow with ID ${whistleBlowId} not found for User ${userId}.`);
        }
      })
      .catch((error) => {
        console.error("Error fetching whistle blow data:", error);
      });
  }, []);

  // Call the function with the user ID and whistle blow ID you want to fetch data for

  useEffect(() => {
    getWhistleBlow(userId, whistleBlowId);
  }, [userId, whistleBlowId]);

  // Call the function with the user ID you want to fetch data for
  // Replace userId with the actual user ID you want to fetch data for

  // const listenForNewSosWithNotification = () => {
  //   const db = getDatabase();
  //   const usersRef = ref(db, 'users');

  //   onChildChanged(usersRef, (snapshot) => {
  //     const user = snapshot.val();
  //     const { userName } = user;

  //     if (user.SOS) {
  //       const sosData = user.SOS;

  //       for (const sosId in sosData) {
  //         const sosItem = sosData[sosId];

  //         if (!sosItem.isRead) {
  //           // Show a notification for the new SOS
  //           toast.warning(`${userName} Needs Emergency Help`, { autoClose: 3000 });

  //           // Update the isRead property to true
  //           const sosRef = child(ref(db, `users/${user.uid}/SOS`), sosId);
  //           // update(sosRef, { isRead: true });
  //         }
  //       }
  //     }
  //   });
  // };

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
    // listenForNewSosWithNotification()
    getWhistleBlow();
  }, []);

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
      <DashboardNavbar />
      <ToastContainer />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
                  User
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
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default WhistleBlowSingleUser;
