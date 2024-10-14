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
import EmptyData from "components/EmptyData";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function VehicleDetail() {
  const [rows, setRows] = useState([]);
  const { columns } = authorsTableData();
  const params = useParams();
  const [controller, dispatch] = useMaterialUIController();

  const { loggedIn } = controller;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
  }, []);

  const getData = async () => {
    setRows([]);
    try {
      const db = getDatabase();
      console.log("id", params.id);
      const starCountRef = ref(db, `users/${params.id}`);
      const snapshot = await get(starCountRef);
      console.log("fetch data by id", snapshot.val());

      const item = snapshot.val();
      const rowItem = {
        Sr: 1,
        Name: item?.userName,
        Email: item?.userEmail,
        Image: (
          <img
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
    } catch (error) {
      console.error("Error fetching data by id:", error);
    }
  };

  const naivgate = useNavigate();
  let user = localStorage.getItem("user");
  // console.log("storage user >>>>>>>", user);
  // if (!user) {
  // naivgate("/authentication/sign-in");
  // }
  useEffect(() => {
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
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default VehicleDetail;
