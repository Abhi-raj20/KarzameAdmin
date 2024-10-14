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
import { useParams } from "react-router-dom";

// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue } from "firebase/database";
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

// import projectsTableData from "layouts/tables/data/projectsTableData";
function UserProfile() {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");

  const { columns } = authorsTableData();
  const params = useParams();

  const getData = async () => {
    const db = getDatabase();
    console.log("id", params.id);
    const starCountRef = ref(db, `users/${params.id}`);
    onValue(starCountRef, (snapshot) => {
      console.log("fetch data by id", snapshot.val());
      const item = snapshot.val();
      const rowItem = {
        Sr: 1,
        Name: item?.userName,
        Email: item?.userEmail,
        Image: (
          <img
            onClick={() => handleImageClick(item.userImage)}
            src={item?.userImage}
            alt="react logo"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        Phone: item?.userPhone,
        Gender: item?.userGender,
        status: item?.userEmail,
        employed: item?.userImage,
        action: <Link to={`/locate/${item?.key}`}> Track </Link>,
      };
      setRows([rowItem]);
    });
  };

  const naivgate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { loggedIn } = controller;

  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  // const { loggedIn } = controller;

  // if(!loggedIn){
  //   // alert(loggedIn);
  //   naivgate("/authentication/sign-in");

  // }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
    getData();
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
                  Users
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
          </Grid>
        </Grid>
        <ImageModal
          onClickImageData={onClickImageData}
          onClose={onClose}
          isModalOpen={isModalOpen}
        />
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default UserProfile;
