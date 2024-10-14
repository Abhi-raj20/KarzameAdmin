import { useEffect, useState} from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import button from "assets/theme/components/button";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { renderPoliceAlert } from "layouts/NotificationAlert";
import renderNoti from "layouts/NotificationAlert";

import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";


function PoliceAlerts() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [notiData, setNotiData] = useState([]);
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { loggedIn } = controller;








  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      A simple {name} alert with{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        an example link
      </MDTypography>
      . Give it a click if you like.
    </MDTypography>
  );

  const getData = async () => {
    // setRows([]);
    let index = 0;
    const dataBase = getDatabase();
    const userss = ref(dataBase, "/users");
    onValue(userss, (snapShot) => {
      console.log("users", snapShot.val());
      const data = snapShot.val();
      setNotiData(data);
      console.log("snapshot", snapShot.val());
    });
  };

  // const showSoSAlert = () => {
  //   {
  //     Object.entries(notiData).map((mainItem) => {
  //       console.log("police alert ", mainItem);
  //       if (mainItem[1]?.Police_Alerts) {
  //         Object.entries(mainItem[1]?.Police_Alerts).map((item) => {
  //           if (Object.values(item[1])) {
  //             // setInfoSB(true)
  //             toast.success(`${item[1]?.userName} Need Emergency Help  `, { autoClose: 3000 });
  //             // setContent(`${item[1]?.userName} Need Emergency Help  `);
  //           }
  //         });
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
       const user = localStorage.getItem("user");
    if (!user) {
      navigate("/authentication/sign-in");
    }
    getData();
    renderPoliceAlert();
    renderNoti();
  }, []);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <ToastContainer />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Alerts</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {Object.entries(notiData).map((mainItem) => {
                  console.log("police alert ", mainItem);
                  if (mainItem[1]?.Police_Alerts) {
                    return Object.entries(mainItem[1]?.Police_Alerts).map((item) => {
                      console.log("p_Alerts", item);
                      return (
                        <>
                          <MDSnackbar
                            icon="notifications"
                            title="Material Dashboard"
                            content="Hello, world! This is a notification message"
                            dateTime="11 mins ago"
                            open={infoSB}
                            onClose={closeInfoSB}
                            close={closeInfoSB}
                          />
                          <MDAlert color="warning" style={{ borderRadius: 0 }}>
                            {/* {alertContent("warning")} */}
                            <MDTypography variant="body2" color="white">
                              {mainItem[1].userName} Vehicle
                              <MDTypography
                                component="a"
                                href="#"
                                variant="body2"
                                fontWeight="medium"
                                color="white"
                              ></MDTypography>
                              is Stolen
                            </MDTypography>
                            {/* {openWarningSB()} */}
                            <div
                              className="positon-relative"
                              style={{ marginLeft: (window.innerWidth * 10) / 100 }}
                            >
                              <MDButton
                                onClick={() => alert("jello")}
                                style={{
                                  borderRadius: 0,
                                  borderTopRightRadius: 5,
                                  float: "right",
                                  height: 60,
                                }}
                                color="warning"
                              >
                                Check Vehicle
                              </MDButton>
                              <MDButton
                                style={{ borderRadius: 0, float: "right", height: 60 }}
                                color="warning"
                              >
                                <Link style={{ color: "white" }} to={`/UserProfile/${mainItem[0]}`}>
                                  {" "}
                                  see profile{" "}
                                </Link>
                              </MDButton>
                            </div>
                          </MDAlert>
                        </>
                      );
                    });

                    // setWarningSB(true)
                  }
                })}

                <Grid item xs={12} sm={6} lg={3}>
                  {renderSuccessSB}
                </Grid>

                {/* {notiData &&
                  notiData.map((item, index) => {
                    console.log("map data", item);
                  })} */}
                {/* <MDAlert color="primary" dismissible>
                  {alertContent("primary")}
                </MDAlert>
                <MDAlert color="secondary" dismissible>
                  {alertContent("secondary")}
                </MDAlert>
                <MDAlert color="success" dismissible>
                  {alertContent("success")}
                </MDAlert> */}
                {/* <MDAlert color="error" dismissible>
                  {alertContent("error")}
                </MDAlert>
                <MDAlert color="warning" dismissible>
                  {alertContent("warning")}
                </MDAlert>
                <MDAlert color="info" dismissible>
                  {alertContent("info")}
                </MDAlert>
                <MDAlert color="light" dismissible>
                  {alertContent("light")}
                </MDAlert>
                <MDAlert color="dark" dismissible>
                  {alertContent("dark")}
                </MDAlert> */}
              </MDBox>
            </Card>
          </Grid>

          {/* <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Notifications</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Notifications on this page use Toasts from Bootstrap. Read more details here.
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="success" onClick={openSuccessSB} fullWidth>
                      success notification
                    </MDButton>
                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="info" onClick={openInfoSB} fullWidth>
                      info notification
                    </MDButton>
                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="warning" onClick={openWarningSB} fullWidth>
                      warning notification
                    </MDButton>
                    {renderWarningSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MDButton variant="gradient" color="error" onClick={openErrorSB} fullWidth>
                      error notification
                    </MDButton>
                    {renderErrorSB}
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default PoliceAlerts;
