// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

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
import { dataBase, db } from "../../firebase";
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
function ActiveSub() {
  const naivgate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const allData = useSelector((state) => state.data.allData);
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

  const [timeMod, setSubTimeMod] = useState(false); // Dialog open/closed state
  const [manualMonths, setManualMonths] = useState(0); // Number of months to add manually

  const [selectedValue, setSelectedValue] = useState(""); // State to store the selected value
  const [currenPlane, setCurrentPlane] = useState(""); // State to store the selected value

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

  const updateSubscriptionValue = useCallback((subscriptionType, newValue) => {
    const dataBase = getDatabase();
    const adminRef = ref(dataBase, "/adminLogin");
    if (subscriptionType == "Basic" && newValue == 0) {
      var newValue = "Free";
    }
    // Get the current admin data
    onValue(adminRef, async (snapshot) => {
      const adminData = snapshot.val(); // Get the data at the adminLogin location

      if (adminData && adminData.Subscription) {
        // Update the value for the specified subscription type
        adminData.Subscription[subscriptionType] = newValue;

        // Update the database with the modified data
        await set(adminRef, adminData);

        console.log(`Updated ${subscriptionType} to ${newValue}`);
        setSubModal(false);
      } else {
        console.log("No Subscription data found.");
      }
    });
  }, []);

  const updatePriceForUser = () => {
    console.log("updated Sub Value", updateSubVal);
    try {
      const dataBase = getDatabase();
      const adminRef = ref(dataBase, "/adminLogin");
      const userRef = ref(dataBase, `/users/${subValues.id}`);

      // Fetch the current value of OneUsd from admin data
      get(adminRef)
        .then((snapshot) => {
          const adminData = snapshot.val();
          if (adminData && adminData.Subscription && adminData.Subscription.OneUsd) {
            const OneUsd = adminData.Subscription.OneUsd;

            console.log("one Usd ", OneUsd);
            let data = updateSubVal;

            if (data.Basic == 0 || data.Basic == "Free") {
              data.Basic = "Free";
              data.Naira_Basic = "Free";
              data.Naira_Standard = data.Standard * Number(OneUsd);
              data.Naira_Premium = data.Premium * Number(OneUsd);
            } else {
              data.Naira_Basic = data.Basic * OneUsd;
              data.Naira_Standard = data.Standard * Number(OneUsd);
              data.Naira_Premium = data.Premium * Number(OneUsd);
            }

            // Update the user's data with the subscription data
            update(userRef, {
              Price: { ...data },
            });
            setSubModal(false);
          } else {
            console.log("No OneUsd value found in admin data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    } catch (error) {
      // Handle the error, e.g., log it or show an error message.
      console.error("Error updating user data:", error);
      // You might also set a state variable to show an error message to the user.
    }
  };

  const fetchSubscriptionDataAndUpdateUser = (userId) => {
    const dataBase = getDatabase();
    const userRef = ref(dataBase, `/users/${userId}`); // Adjust the path according to your database structure

    return get(userRef).then((userSnapshot) => {
      const userData = userSnapshot.val();

      if (userData && userData.Price) {
        // User already has a "Price" value
        console.log("user already have Price", userData.Price);
        setSubValues({ ...userData.Price, id: userId });
        SetUpdateSubVal({ ...userData.Price, id: userId });

        return true; // Return true to indicate that the data was already present
      } else {
        // User does not have a "Price" value, fetch from adminLogin
        const adminRef = ref(dataBase, "/adminLogin");
        return get(adminRef).then((adminSnapshot) => {
          const adminData = adminSnapshot.val();
          if (adminData && adminData.Subscription) {
            const subscriptionData = adminData.Subscription;

            // Update the user's data with the subscription values
            return update(userRef, {
              Price: subscriptionData,
            })
              .then(() => {
                setSubValues({ ...subscriptionData, id: userId });
                SetUpdateSubVal({ ...subscriptionData, id: userId });
                console.log("Data updated successfully");
                return true; // Return true to indicate a successful update
              })
              .catch((error) => {
                console.error("Data update failed", error);
                return false; // Return false to indicate an update failure
              });
          } else {
            console.log("No Subscription data found in adminLogin.");
            return false; // Return false to indicate no Subscription data found
          }
        });
      }
    });
  };

  function calculateTimeDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const difference = end - start;

    // Define time units and their conversion factors
    const units = [
      { label: "year", factor: 1000 * 60 * 60 * 24 * 365 },
      { label: "month", factor: 1000 * 60 * 60 * 24 * 30 },
      { label: "day", factor: 1000 * 60 * 60 * 24 },
      { label: "hour", factor: 1000 * 60 * 60 },
      { label: "minute", factor: 1000 * 60 },
      { label: "second", factor: 1000 },
    ];

    let remainingDifference = difference;
    const parts = [];

    for (const unit of units) {
      const unitCount = Math.floor(remainingDifference / unit.factor);

      if (unitCount > 0) {
        parts.push(`${unitCount} ${unit.label}${unitCount > 1 ? "s" : ""}`);
        remainingDifference %= unit.factor;
      }
    }

    if (parts.length === 0) {
      return <span className="label label-danger text-danger fs-7">Expired</span>;
      // Handle case where difference is very small
    }

    return parts.join(" ");
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

  function PlusButton(item) {
    const hasSubscriptionDates = item.subscriptionStartDate && item.subscriptionEndDate;
    return (
      <div>
        {hasSubscriptionDates ? (
          <div>
            {calculateTimeDifference(item.subscriptionStartDate, item.subscriptionEndDate)}
            <IconButton
              color="primary"
              aria-label="add"
              onClick={() => {
                console.log("plane+++++++", item.subscription);
                setSubTimeMod(true);
                setSelectedValue(item?.subscription);
                setUsrId(item.key);
                setCurrentPlane(item.subscription);
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        ) : (
          <>
            <span>
              {`0 Minutes `}
              <button
                className="btn btn-sm btn-warning"
                color="primary"
                aria-label="add"
                onClick={() => {
                  console.log("plane ===========", item.subscription);
                  setSubTimeMod(true);
                  setSelectedValue("");
                  setUsrId(item.key);
                  setCurrentPlane("No Active Subscription");
                }}
              >
                Add a Plan
              </button>
            </span>
          </>
        )}
      </div>
    );
  }

  const getData = async () => {
    setLoading(true);

    setRows([]);
    const dataBase = getDatabase();
    const userss = ref(dataBase, "/users");

    const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city

    try {
      const snapShot = await get(userss);
      if (snapShot.exists()) {
        const data = snapShot.val();
        let index = 0;
        const newRows = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            index = index + 1;
            const item = data[key];
            const subs = calculateTimeDifference(
              item.subscriptionStartDate,
              item.subscriptionEndDate
            );
            console.log("sub", subs, typeof subs);
            console.log("check", typeof subs === "object");
            if (typeof subs !== "object") {
              if (allData || item.userState.toLowerCase() === currentAdminState.toLowerCase()) {
                console.log("sub", subs);
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
                  Status: item.isActive == true ? "Approved" : "Suspended",
                  Suspend: <button className="btn btn-danger btn-sm">Suspend</button>,

                  action: <Link to={`/locate/${key}?userData=truck`}>Track</Link>,
                };
                newRows.push(rowItem);
              }
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
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [allData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

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

    if (selectedValue == "" && (manualMonths == 0 || !selectedDate.format)) {
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

      if (manualMonths !== 0 && userData.subscriptionEndDate) {
        var subscriptionEndDate = new Date(userData.subscriptionEndDate);
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + Number(manualMonths));

        selectedValue !== ""
          ? await update(userRef, {
              subscriptionEndDate: subscriptionEndDate.toString(),
              subscription: selectedValue,
              subscription_status: true,

              // Update other user data if needed
            })
          : await update(userRef, {
              subscriptionEndDate: subscriptionEndDate.toString(),
              subscription_status: true,
              // Update other user data if needed
            });
      } else if (manualMonths !== 0 && !userData.subscriptionEndDate) {
        const currentDate = new Date();
        selectedValue !== ""
          ? await update(userRef, {
              subscriptionStartDate: currentDate.toString(),
              subscription: selectedValue,
              subscription_status: true,
              // Update other user data if needed
            })
          : await update(userRef, {
              subscriptionStartDate: currentDate.toString(),
              subscription_status: true,
              // Update other user data if needed
            });

        // Calculate and update subscriptionEndDate
        const subscriptionEndDate = new Date(currentDate);
        subscriptionEndDate.setMonth(currentDate.getMonth() + Number(manualMonths));
        await update(userRef, {
          subscriptionEndDate: subscriptionEndDate.toString(),
          subscription_status: true,
          // Update other user data if needed
        });
      } else if (userData.subscriptionEndDate && manualMonths == 0) {
        // const newFormat = moment(selectedDate).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ')
        const formattedDate = selectedDate.format("YYYY-MM-DDTHH:mm:ssZ");
        // var subscriptionEndDate = moment(selectedDate._d).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ');
        await update(userRef, {
          subscriptionEndDate: selectedDate.toString(),
          subscription_status: true,
          // Update other user data if needed
        });
      } else if (!userData.subscriptionEndDate && manualMonths == 0) {
        const currentDate = new Date();
        const subscriptionEndDate = new Date(currentDate);
        subscriptionEndDate.setDate(currentDate.getDate() + selectedDate);

        await update(userRef, {
          subscriptionStartDate: currentDate.toString(),
          subscriptionEndDate: subscriptionEndDate.toString(),
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
                    <ToastContainer />
                    <MDTypography variant="h6" color="white">
                      Active Users
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

                <Dialog open={timeMod} onClose={() => setSubTimeMod(false)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} lg={12}>
                      <DialogContent className="col-12">
                        <Grid container spacing={2} className="mt-0">
                          <Grid item xs={12} lg={12}>
                            <Typography variant="h5">
                              Current Plan :{" "}
                              {currenPlane != "" ? currenPlane : "Not A Subcriber Yet"}
                            </Typography>
                            <Typography variant="h5" className="mt-0 mb-3">
                              Select a New Plan
                            </Typography>
                            <div className="mt-1">
                              <FormControl fullWidth>
                                <InputLabel className="" id="select-label">
                                  Select Value
                                </InputLabel>
                                <Select
                                  labelId="select-label"
                                  id="select"
                                  className="form-control-lg mt-0"
                                  value={selectedValue}
                                  label="Select Value"
                                  onChange={(e) => setSelectedValue(e.target.value)}
                                >
                                  <MenuItem value="Basic">Basic</MenuItem>
                                  <MenuItem value="Premium">Premium</MenuItem>
                                  <MenuItem value="Standard">Standard</MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} className="mt-0 mb-0">
                          <Grid item xs={12} lg={12}>
                            {/* <h4 className="h5 text-dark">Select A Time Duration</h4> */}
                            <div className="mb-1 mt-0">
                              <Typography variant="h8" className="text-dark">
                                Extend Time
                              </Typography>
                            </div>
                            <TextField
                              label="Add Months Manually"
                              type="number"
                              value={manualMonths}
                              onChange={(e) => setManualMonths(e.target.value)}
                            />
                          </Grid>

                          {/* <div className="mb-3 mt-3 ms-3">
                        <Typography variant="h6" type="block">
                          
                        </Typography>
                      </div> */}

                          <Grid item xs={12} lg={12} style={{ paddingBottom: 120 }}>
                            <div className="mb-0   mt-0">
                              <Typography variant="h7" className="text-dark" component={"div"}>
                                Select Date From Calender
                              </Typography>
                            </div>
                            <Datetime
                              value={selectedDate}
                              onWheel={(e) => e.preventDefault()}
                              closeOnClickOutside={false}
                              closeOnSelect={true}
                              onChange={(date) => {
                                setManualMonths(0);
                                setSelectedDate(date);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </DialogContent>
                      <DialogActions className="mt-2">
                        <Button onClick={() => setSubTimeMod(false)}>Cancel</Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className="text-light"
                          onClick={() => handleUpdateTime()}
                        >
                          Save
                        </Button>
                      </DialogActions>
                    </Grid>
                  </Grid>
                </Dialog>

                <Modal open={planModal} onClose={() => setPlanModal(false)}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 400,
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 2,
                    }}
                  >
                    <Typography variant="h5">
                      Current Plan : {currenPlane != "" ? currenPlane : "Not A Subcriber Yet"}
                    </Typography>
                    <Typography variant="h5" className="mt-1">
                      Select a New Plan
                    </Typography>
                    <div className="mt-3">
                      <FormControl fullWidth>
                        <InputLabel className="" id="select-label">
                          Select Value
                        </InputLabel>
                        <Select
                          labelId="select-label"
                          id="select"
                          className="form-control-lg mt-0"
                          value={selectedValue}
                          label="Select Value"
                          onChange={(e) => setSelectedValue(e.target.value)}
                        >
                          <MenuItem value="Basic">Basic</MenuItem>
                          <MenuItem value="Premium">Premium</MenuItem>
                          <MenuItem value="Standard">Standard</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <Button
                      onClick={() => setPlanModal(false)}
                      variant="contained"
                      color="secondary"
                      sx={{ mt: 2 }}
                      className="text-light mb-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="text-light ms-3 mb-3"
                      onClick={handleSave}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Save
                    </Button>
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

export default ActiveSub;
