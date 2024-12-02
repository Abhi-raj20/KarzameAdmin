// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import io from 'socket.io-client';

import Datetime from "react-datetime";
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

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// import auth from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
// import { collection, getDoc } from "firebase/firestore/lite";
import { getDatabase, ref, onValue, set, update, get } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { dataBase, db } from "../firebase";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useSyncExternalStore } from "react";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { showStyledToast } from "components/toastAlert";
import { OpenInFull } from "@mui/icons-material";
import ImageModal from "components/ImageModal";
import { getCurrentAdminState } from "Utils/Functions";
import EmptyData from "components/EmptyData";
import { useSelector } from "react-redux";

// import projectsTableData from "layouts/tables/data/projectsTableData";


const socket = io('wss://ws.itracknet.com', {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd'
  }
});


function DeviceTrigger() {
  const naivgate = useNavigate();
  const allData = useSelector((state) => state.data.allData);
  const [controller, dispatch] = useMaterialUIController();

  const [rows, setRows] = useState([]);
  const { columns } = authorsTableData();
  const { loggedIn } = controller;

  const [searchTxt, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onClickImageData, setOnClickImageData] = useState("");

  const [selectedPlan, setSelectedPlan] = useState("");
  const [priceCounter, setPriceCounter] = useState(30); // Default price
  const [subValues, setSubValues] = useState({ Basic: 0, Premium: 0, Standard: 0 });

  const [updateSubVal, SetUpdateSubVal] = useState({ Basic: 0, Premium: 0, Standard: 0 });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const [timeMod, setSubTimeMod] = useState(false); // Dialog open/closed state
  const [manualMonths, setManualMonths] = useState(0); // Number of months to add manually

  const [selectedValue, setSelectedValue] = useState(""); // State to store the selected value
  const [currenPlane, setCurrentPlane] = useState(""); // State to store the selected value

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Connecting...');

  const [usrId, setUsrId] = useState("");
 
  const handleImageClick = (url) => {
    setIsModalOpen(true);
    setOnClickImageData(url);
  };

  const [subModal, setSubModal] = useState(false);

  const [planModal, setPlanModal] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (selectedValue == "") {
      return;
    }
    try {
      const dataBase = getDatabase();
      const userRef = ref(dataBase, `/users/${usrId}`);
      // Update the user's data with the subscription data
      update(userRef, {
        subscription: selectedValue,
      });
      getData();
      console.log("this is a getData funcation", getData());
      

      setPlanModal(false);
    } catch (error) {
      // Handle the error, e.g., log it or show an error message.
      console.error("Error updating user data:", error); 
      // You might also set a state variable to show an error message to the user.
    }
  };

  const dialogStyle = {
    // Customize the style to make the dialog larger
    minWidth: "600px", // Adjust the width to your preference
    minHeight: "900px", // Adjust the height to your preference
  };

  //socket connection work 
  useEffect(() => {
    socket.on('connect', () => {
      setStatus('Connected');
      console.log("Connection established");
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected');
      console.log("Disconnected from server");
    });

    socket.on('message', ({data}) => {
      // setMessage(data);
      console.log("data retrieve...",data);
      
    });

    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', 'Hello from React!');
  };

  const deviceTrigger = () => {
    socket.on('getAllData', (data) => {
      const deviceData = data?.userName; 
      console.log("get All data", data);
      console.log("device data ", deviceData); 
      
    })
  }
  

  

  
  const handleOpenSubModal = async (id) => {
    console.log("user id ", id);
    const res = await fetchSubscriptionDataAndUpdateUser(id);
    if (res == true) {
      setSubModal(true);
    }
  };
  const handleOpenPlaneModal = async (id, val) => {
    console.log("user id ", val);
    setUsrId(id);
    setPlanModal(true);
    if (!val) {
      setCurrentPlane("No Active Subscription");
    } else {
      setCurrentPlane(val);
    }
  };

  

  

  const getData = async () => {
    setLoading(true);
    setRows([]);
    const dataBase = getDatabase();
    const userss = ref(dataBase, "/users");
    try {
      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city
            
      const snapShot = await get(userss);
      if (snapShot.exists()) {
        const data = snapShot.val();
        let index = 0;
        const newRows = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            index = index + 1;
            const item = data[key];
            if (
              (allData || item.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
              item.userGSM === "Standard User"
            ) {
              const rowItem = {
                Sr: index,
                Name: item.userName,
                Email: item.userEmail,
                subTime: PlusButton(item),
                Image: (
                  <img
                    onClick={() => handleImageClick(item.userImage)}
                    src={item.userImage}
                    alt="react logo"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                ),
                Phone: item.userPhone,
                plan:
                  item.subscription === "Basic" ? (
                    <h5 className="h5 btn btn-primary btn-sm">{item.subscription}</h5>
                  ) : item.subscription === "Premium" ? (
                    <h5 className="h5 btn btn-success btn-sm">{item.subscription}</h5>
                  ) : item.subscription === "Standard" ? (
                    <h5 className="h5 btn btn-warning btn-sm">{item.subscription}</h5>
                  ) : (
                    <h5 className="h5 btn btn-danger btn-sm">No Active Subscription</h5>
                  ),
                changePlan:
                  (item.subscription ? <h6>{item?.subscription}</h6> : <h6>Not Subscribed</h6>,
                  (
                    <button
                      onClick={() => handleOpenPlaneModal(key, item.subscription)}
                      className="btn btn-primary btn-sm"
                    >
                      Change Plan
                    </button>
                  )),
                planAction: (
                  <button
                    onClick={() => handleOpenSubModal(key)}
                    className="btn btn-primary btn-sm"
                  >
                    Change Price
                  </button>
                ),
                Gender: item.userGender,
                Status: (
                  <button
                    className={
                      item.isActive == true ? "btn btn-sm btn-success" : "btn btn-danger btn-sm"
                    }
                  >
                    {item.isActive == true ? "Approved" : "Suspended"}
                  </button>
                ),
                Suspend: (
                  <button onClick={() => acceptWorker(item)} className="btn btn-danger btn-sm">
                    {" "}
                    {item.isActive == true ? "Suspend" : "Active"}
                  </button>
                ),

                action: <Link to={`/locate/${key}?userData=truck`}>Track</Link>,
              };
              newRows.push(rowItem);
              console.log("user data info", rowItem);
              
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
    const user = localStorage.getItem("user");
    if (!user) { 
      naivgate("/authentication/sign-in");
    }   
    getData();
  }, [allData]);

  // const handleSubscriptionUpdate = useCallback(() => {
  //   updateSubscriptionValue(selectedPlan, priceCounter)
  // }, [priceCounter, selectedPlan])

  const handlePriceChange = (newPrice) => {
    setPriceCounter(newPrice);
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

  const handleUpdateTime = async () => {
    console.log(selectedDate._i);

    console.log("selected plan", selectedValue);

    if (selectedValue == "" || selectedValue === "Basic" || !selectedDate.format) {
      alert("Plan should not be Basic");
      return;
    }

    try {
      const dataBase = getDatabase();
      const userRef = ref(dataBase, `/users/${usrId}`);

      // Fetch the user's data
      const userSnapshot = await get(userRef);

      const userData = userSnapshot.val();

      console.log("userDta", userData);

      // Convert the subscriptionEndDate to a Date object

      if (userData.subscriptionEndDate !== "null") {
        // const newFormat = moment(selectedDate).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ')
        const formattedDate = selectedDate.format("YYYY-MM-DDTHH:mm:ssZ");
        // var subscriptionEndDate = moment(selectedDate._d).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ');
        await update(userRef, {
          subscription: selectedValue,
          subscriptionEndDate: selectedDate.toString(),
          subscription_status: true,
          // Update other user data if needed
        });
      } else if (userData.subscriptionEndDate === "null") {
        const currentDate = new Date();
        const subscriptionEndDate = new Date(currentDate);
        subscriptionEndDate.setDate(currentDate.getDate() + selectedDate);

        const formattedDate = selectedDate.format("YYYY-MM-DDTHH:mm:ssZ");

        await update(userRef, {
          subscription: selectedValue,
          subscriptionStartDate: currentDate.toString(),
          subscriptionEndDate: selectedDate.toString(),
          subscription_status: true,
          // Update other user data if needed
        });
      }

      // Close the dialog or perform any other necessary actions
      setSubTimeMod(false);
      getData();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
   <>
     <div className="app-container">
    <div className="main-content">
      <h1>Socket.IO with React</h1>
      <button onClick={sendMessage}>Send Message</button>
      <p>Status: {status}</p>
      <p>Received message: {message}</p>
      <p>Device Trigger data : {() => deviceTrigger}</p>
    </div>
    </div>
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
                    Device Trigger Events
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
              {/* <Modal
              open={isModalOpen}
              style={{ borderRadius: 20 }}
              onClose={() => setIsModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            > */}
              <ImageModal
                onClickImageData={onClickImageData}
                onClose={onClose}
                isModalOpen={isModalOpen}
              />
              {/* </Modal> */}

              <Dialog open={subModal} onClose={() => setSubModal(false)}>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} lg={12}>
                      <Card className="mt-3">
                        <CardContent>
                          <Grid container>
                            <Grid item xs={6}>
                              {/* Left side content */}
                                <Typography variant="h5" component="div">
                                Basic
                              </Typography>
                              <Typography>Plan: Basic </Typography>
                              <Typography>
                                Price: <span className="h4">{subValues?.Basic}</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {/* Right side content */}
                              <div className="mt-4">
                                {/* <Typography variant="h6" className="mt-0 mb-2">Change Price</Typography> */}
                                <Button
                                  variant="contained"
                                  className="text-light btn-sm"
                                  color="primary"
                                  onClick={() => {
                                    updateSubVal.Basic == "Free"
                                      ? SetUpdateSubVal({ ...updateSubVal, Basic: 0 + 1 })
                                      : SetUpdateSubVal({
                                          ...updateSubVal,
                                          Basic: updateSubVal.Basic + 1,
                                        });
                                  }}
                                >
                                  +
                                </Button>
                                <Typography variant="h6" className="ms-3" component={"span"}>
                                  {updateSubVal.Basic !== "Free"
                                    ? updateSubVal.Basic + " USD"
                                    : updateSubVal.Basic}
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  className="text-light btn-sm ms-3"
                                  onClick={() => {
                                    return updateSubVal.Basic == "Free" || updateSubVal.Basic == 1
                                      ? SetUpdateSubVal({ ...updateSubVal, Basic: "Free" })
                                      : SetUpdateSubVal({
                                          ...updateSubVal,
                                          Basic: updateSubVal.Basic - 1,
                                        });
                                  }}
                                >
                                  -
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Card className="mt-3">
                        <CardContent>
                          <Grid container>
                            <Grid item xs={6}>
                              {/* Left side content */}
                              <Typography variant="h5" component="div">
                                Standard
                              </Typography>
                              <Typography>Plan: Standard</Typography>
                              <Typography>
                                Price: <span className="h4">{subValues?.Standard}</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {/* Right side content */}
                              <div className="mt-4">
                                {/* <Typography variant="h6" className="mt-0 mb-2">Change Price</Typography> */}
                                <Button
                                  variant="contained"
                                  className="text-light btn-sm"
                                  color="primary"
                                  onClick={() =>
                                    SetUpdateSubVal({
                                      ...updateSubVal,
                                      Standard: updateSubVal.Standard + 1,
                                    })
                                  }
                                >
                                  +
                                </Button>
                                <Typography variant="h6" className="ms-3" component={"span"}>
                                  {updateSubVal.Standard} USD
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  className="text-light btn-sm ms-3"
                                  onClick={() => {
                                    return updateSubVal.Standard == 1
                                      ? null
                                      : SetUpdateSubVal({
                                          ...updateSubVal,
                                          Standard: updateSubVal.Standard - 1,
                                        });
                                  }}
                                >
                                  -
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Card className="mt-3">
                        <CardContent>
                          <Grid container>
                            <Grid item xs={6}>
                              {/* Left side content */}
                              <Typography variant="h5" component="div">
                                Premium
                              </Typography>
                              <Typography>Plan: Premium</Typography>
                              <Typography>
                                Price: <span className="h4">{subValues?.Premium}</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              {/* Right side content */}
                              <div className="mt-4">
                                {/* <Typography variant="h6" className="mt-0 mb-2">Change Price</Typography> */}
                                <Button
                                  variant="contained"
                                  className="text-light btn-sm"
                                  color="primary"
                                  onClick={() =>
                                    SetUpdateSubVal({
                                      ...updateSubVal,
                                      Premium: updateSubVal.Premium + 1,
                                    })
                                  }
                                >
                                  +
                                </Button>
                                <Typography variant="h6" className="ms-3" component={"span"}>
                                  {updateSubVal && updateSubVal.Premium} USD
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  className="text-light btn-sm ms-3"
                                  onClick={() => {
                                    return updateSubVal.Premium == 1
                                      ? null
                                      : SetUpdateSubVal({
                                          ...updateSubVal,
                                          Premium: updateSubVal.Premium - 1,
                                        });
                                  }}
                                >
                                  -
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSubModal(false)}>Cancel</Button>
                  <Button
                    className="text-light"
                    variant="contained"
                    color="primary"
                    onClick={() => updatePriceForUser()}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>


            </Grid>
          )}
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
   </>
  );
}

export default DeviceTrigger;
