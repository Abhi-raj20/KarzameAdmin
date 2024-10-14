// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import "react-datetime/css/react-datetime.css";

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

// import auth from "firebase/firestore";
import { useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set, update, get } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { dataBase, db } from "../../firebase";
import { useMaterialUIController } from "context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";
function ManageLogIn() {
  const naivgate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [rows, setRows] = useState([]);

  const { loggedIn } = controller;
  const allData = useSelector((state) => state.data.allData);
  const [searchTxt, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showManageColum, setShowManageColum] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");

  const columns = [
    {
      Header: <span style={{ color: "blue" }}>Sr</span>,
      accessor: "Sr",
      width: "5%",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Image</span>,
      accessor: "Image",
      width: "10%",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}> Email</span>,
      accessor: "Email",
      width: "10%",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Name</span>,
      accessor: "Name",
      width: "10%",
      align: "left",
    },
    {
      Header: <span style={{ color: "blue" }}>Phone</span>,
      accessor: "Phone",
      width: "10%",
      align: "left",
    },

    // { Header: "Email", accessor: "Email", align: "left" },

    {
      Header: <span style={{ color: "blue" }}>Gender</span>,
      accessor: "Gender",
      align: "center",
    },

    {
      Header: (
        <span style={{ color: "blue" }}>{showManageColum ? "Manage User" : "Manage User"}</span>
      ),
      accessor: "Suspend",
      align: "center",
    },
    {
      Header: <span style={{ color: "blue" }}>Action</span>,
      accessor: "action",
      align: "center",
    },
  ];

  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const getData = async () => {
    setLoading(true);
    setRows([]);
    const dataBase = getDatabase();
    const userss = ref(dataBase, "/users");
    let index = 0;
    try {
      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city

      const snapShot = await get(userss);
      if (snapShot.exists()) {
        const data = snapShot.val();
        const newRows = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const item = data[key];

            if (
              item &&
              item.userState &&
              (allData || item.userState.toLowerCase() === currentAdminState.toLowerCase())
            ) {
              if (item.loggedIn) {
                setShowManageColum(true);
              }
              index = index + 1;
              const rowItem = {
                Sr: index,
                Name: item.userName,
                Email: item.userEmail,

                Image: (
                  <img
                    onClick={() => handleImageClick(item.userImage)}
                    src={item.userImage}
                    alt="react logo"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                ),
                Phone: item.userPhone,

                Gender: item.userGender,

                // Conditionally render the Suspend button based on item.loggedIn
                Suspend: (
                  <button
                    disabled={!item.loggedIn}
                    onClick={() => acceptWorker(item)}
                    className="btn btn-danger btn-sm"
                  >
                    {item.loggedIn ? "Log Out" : "No available"}
                  </button>
                ),
                action: <Link to={`/locate/${key}?userData=truck`}>Track</Link>,
              };
              newRows.push(rowItem);
            }
          }
        }
        setRows(newRows);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Hide loader after fetching data
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is already logged in
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }

    getData();
  }, [allData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // const handleSubscriptionUpdate = useCallback(() => {
  //   updateSubscriptionValue(selectedPlan, priceCounter)
  // }, [priceCounter, selectedPlan])

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

  const acceptWorker = (item) => {
    if (typeof item !== "object" || !item.key) {
      console.error("Invalid user data:", item);
      return;
    }

    const db = getDatabase();
    update(ref(db, `users/${item.key}`), {
      loggedIn: false,
    })
      .then((res) => {
        setShowManageColum(false);
        console.log("Result of loggedIn update:", res);
        // alert("Worker has been approved");
        getData(); // Assuming getData is a function that retrieves and updates the data
      })
      .catch((error) => {
        console.error("Error updating loggedIn status:", error);
      });
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

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
                  <ToastContainer />
                  <MDTypography variant="h6" color="white">
                    Manage User's Login
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
              {/* <Modal
              open={isModalOpen}
              style={{ borderRadius: 20 }}
              onClose={() => setIsModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                className="col-2"
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  alignSelf: "center",
                  marginTop: "10%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <div className="ms-auto" style={{ marginLeft: "auto" }}>
                  <img
                    src={onClickImageData}
                    alt="post image error"
                    height={300}
                    width={300}
                    id={"9"}
                    style={{ backgroundSize: "cover", borderRadius: 20 }}
                  />
                </div>
              </Box>
            </Modal> */}
            </Grid>
          )}
        </Grid>
      </MDBox> 
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default ManageLogIn;
