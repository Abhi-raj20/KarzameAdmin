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
import { useParams } from "react-router-dom";
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
} from "firebase/database";
import { collection, getDocs, setDoc } from "firebase/firestore";
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
import { showStyledToast } from "components/toastAlert";
import { WaterfallChartOutlined } from "@mui/icons-material";
import ImageModal from "components/ImageModal";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function WellBeingSingleUser() {
  const [rows, setRows] = useState([]);
  const { userId, wellBeingCheckId } = useParams();
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

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
      navigate("/authentication/sign-in");
    }
  }, []);

  //   const { columns } = authorsTableData();
  const columns = [
    { Header: "SR", accessor: "sr", align: "left" },
    { Header: "Type", accessor: "Type", align: "left" },
    { Header: "Sender", accessor: "userName", align: "left" },
    { Header: "Image", accessor: "userImage", align: "left" },
    { Header: "Arrival Date", accessor: "Date", align: "left" },
    { Header: "Vehicle Number", accessor: "No", align: "left" },
    { Header: "Partner", accessor: "partner", align: "left" },
    { Header: "Arrival Time", accessor: "time", align: "center" },
    { Header: "Location", accessor: "Location", align: "center" },
  ];

  const getWellBeingServices = useCallback(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

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
              if (user.wellBeingServicesData) {
                const wellBeingData = user.wellBeingServicesData;

                // Check if the specific well-being check exists
                if (wellBeingData[wellBeingCheckId]) {
                  const wellBeingServiceItem = wellBeingData[wellBeingCheckId];
                  console.log("item of well being check", wellBeingServiceItem);

                  // Create a wellBeingServicesData object and add it to the array
                  const wellBeingServicesDataObject = {
                    sr: 1, // Assuming sr is a property of the wellBeingServiceItem
                    ker: wellBeingServiceItem.ker, // Assuming ker is a property of the wellBeingServiceItem
                    Type: <button className={` btn btn-sm`}>{wellBeingServiceItem?.Type}</button>,
                    Date: wellBeingServiceItem?.ArrivalDate,
                    time: wellBeingServiceItem?.ArrivalTime,
                    userName: wellBeingServiceItem?.Name,
                    No: wellBeingServiceItem?.VehicleNumber,
                    partner: wellBeingServiceItem?.PartenerType,
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
                    wellBeingService: wellBeingServiceItem.data,
                  };
                  usersWithWellBeingServices.push(wellBeingServicesDataObject);
                }
              }
            }
          }

          setRows(usersWithWellBeingServices);
          console.log(usersWithWellBeingServices);
        } else {
          console.log("No users found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  useEffect(() => {
    getWellBeingServices(); // Fetch well-being services for the specified user
  }, [getWellBeingServices]);

  let user = localStorage.getItem("user");
  // console.log("storage user >>>>>>>", user);
  // if (!user) {
  // naivgate("/authentication/sign-in");
  // }
  useEffect(() => {
    // getData();
    // listenForNewSosWithNotification()
    getWellBeingServices();
  }, []);
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
                  User oioioi
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
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

export default WellBeingSingleUser;
