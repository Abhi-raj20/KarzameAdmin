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
import { Box, Modal } from "@mui/material";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function ProviderManagment() {
  const [rows, setRows] = useState([]);
  const allData = useSelector((state) => state.data.allData);
  const navigate = useNavigate();
  const [searchTxt, setSearchText] = useState("");
  const [controller, dispatch] = useMaterialUIController();

  const [loading, setLoading] = useState(false);

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

  //   const { columns } = authorsTableData();
  const columns = [
    { Header: <span style={{ color: "blue" }}>SR</span>, accessor: "SR", align: "left" },
    { Header: <span style={{ color: "blue" }}>Name</span>, accessor: "Name", align: "left" },
    { Header: <span style={{ color: "blue" }}>Type</span>, accessor: "Type", align: "left" },
    { Header: <span style={{ color: "blue" }}>Image</span>, accessor: "Image", align: "left" },
    { Header: <span style={{ color: "blue" }}>Phone</span>, accessor: "Phone", align: "center" },
    {
      Header: <span style={{ color: "blue" }}>Email</span>,
      accessor: "workerMail",
      align: "center",
    },
    { Header: <span style={{ color: "blue" }}>Status</span>, accessor: "Status", align: "center" },
    { Header: <span style={{ color: "blue" }}>verify</span>, accessor: "verify", align: "center" },
    { Header: <span style={{ color: "blue" }}>action</span>, accessor: "action", align: "center" },
  ];

  const acceptWorker = (item, key) => {
    // console.log("itemse", item);
    let data = item;
    data.verified = !data.verified;
    const db = getDatabase();
    set(ref(db, "Operators/" + key), {
      ...data,
    }).then(() => {
      // alert("Worker has been approved");
    });
    getData();
    // return () => clearInterval(interval);
  };

  const getData = async () => {
    setLoading(true);
    setRows([]);

    const dataBase = getDatabase();
    const userss = ref(dataBase, "/Operators");
    const currentAdminState = await getCurrentAdminState();

    let index = 0;
    const arr = [];

    onValue(userss, (snapShot) => {
      snapShot.forEach((doc) => {
        const item = doc.val();

        if (
          (allData || item.workerState.toLowerCase() === currentAdminState.toLowerCase()) &&
          item.workerType === "Towing Services"
        ) {
          index++;
          const key = doc.key;

          const rowItem = {
            SR: index,
            Name: item.workerName,
            Type: item.workerType,
            Email: item.workerMail,
            Image: (
              <img
                onClick={() => handleImageClick(item.workerImage)}
                src={item.workerImage}
                alt="react logo"
                style={{
                  backgroundSize: "cover",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            ),
            Phone: item.workerPhoneNumber,
            Status: item.verified ? (
              <button className="btn btn-success">Approved</button>
            ) : (
              <button className="btn btn-danger">Suspended</button>
            ),
            verify: item.verified ? (
              <button
                type="button"
                key={item.workerPhoneNumber}
                onClick={(e) => {
                  acceptWorker(item, key);
                }}
                class="btn btn text-light btn-success"
              >
                verified
              </button>
            ) : (
              <button
                type="button"
                key={item.workerPhoneNumber}
                onClick={(e) => {
                  acceptWorker(item, key);
                }}
                class="btn btn text-light btn-secondary"
              >
                Accept
              </button>
            ),

            action: <Link to={`/locate/${item.key}?userData=truck`}>Track</Link>,
          };
          arr.push(rowItem);
        }
      });

      // Update the rows state after processing all items
      setRows(arr);

      // Set loading to false once data processing is completed
      setLoading(false);
    });
  };

  const naivgate = useNavigate();
  let user = localStorage.getItem("user");
  // console.log("storage user >>>>>>>", user);
  // if (!user) {
  // naivgate("/authentication/sign-in");
  // }
  useEffect(() => {
    getData();
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

  useEffect(() => {
    if (searchTxt == "") {
      getData();
    }

    if (searchTxt) {
      const filteredRows = rows.filter((row) => {
        console.log("rows ", row);
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
                    <MDTypography variant="h6" color="white">
                      TOWING SERVICE PROVIDER
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
            </>
          )}
        </Grid>
      </MDBox>
      <ImageModal onClickImageData={onClickImageData} onClose={onClose} isModalOpen={isModalOpen} />

      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default ProviderManagment;
