import { useCallback, useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";
import AccessibilityIcon from "@mui/icons-material/Accessibility";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LensIcon from "@mui/icons-material/Lens";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import WarningIcon from "@mui/icons-material/Warning";

import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";

import DriveEtaIcon from "@mui/icons-material/DriveEta";

import PersonIcon from "@mui/icons-material/Person";

import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupIcon from "@mui/icons-material/Group";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AlarmIcon from "@mui/icons-material/Alarm";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";

import { useNavigate } from "react-router-dom";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

import SvgIcon from "@mui/material/SvgIcon";
import { Modal } from 'react-bootstrap';
import ListItemIcon from "@mui/material/ListItemIcon";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setLoggedIn,
} from "context";
import { getDatabase, ref, onValue, set, push, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import SecurityArmsReq from "layouts/SecurityArmsReq/SecurityArmsRequest";
import { FormControlLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleData } from "./../../Redux/Slice/dataSlice";
import { AddIcCall } from "@mui/icons-material";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const navigate = useNavigate();

  const dispatchh = useDispatch();

  const allData = useSelector((state) => state.data.allData);
  const [switchState, setSwitchState] = useState(allData);

  useEffect(() => {
    setSwitchState(allData);
  }, [allData]);



  // useEffect(() => {
  //   console.log("Redux state allData updated: ", allData);
  //   if (!allData) {
  //     console.log("Switch is off");
  //   }
  // }, [allData]);

  const [showOptions, setShowOptions] = useState(false);
  const [provider, setProvider] = useState(false);
  const [trip, setTrip] = useState(false);
  const [wellBeing, seWellBeing] = useState(false);
  const [triggers, setTriggers] = useState(false);
  const [subList, setSubList] = useState(false);

  const [SOS, setSOS] = useState(false);

  const [armsList, setArmsList] = useState("");

  const hanldeSosToggle = useCallback(() => {
    setSOS(!SOS);
  }, [SOS]);

  const handleToggleOptions = useCallback(() => {
    setShowOptions(!showOptions);
  }, [showOptions]);

  const handleWellBeing = useCallback(() => {
    seWellBeing(!wellBeing);
  }, [wellBeing]);

  const handleOpenArmsList = useCallback(() => {
    setArmsList(!armsList);
  }, [armsList]);

  const handleTriggers = useCallback(() => {
    setTriggers(!triggers);
  }, [triggers]);

  const handleSubList = useCallback(() => {
    setSubList(!subList);
  }, [subList]);

  const handleProviders = () => {
    setProvider(!provider);
  };

  const handleTrips = () => {
    setTrip(!trip);
  };

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  const handleLogout = useCallback(async () => {
    await localStorage.removeItem("user");
    setLoggedIn(dispatch, false);
    navigate("authentication/sign-in");
  }, []);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();


    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // State to track whether the switch is on or off
  const [isOn, setIsOn] = useState(false);

  // Function to handle the toggle action
  const handleToggle = () => {
    setIsOn((prevState) => !prevState);
  };


  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');   // To store entered password
  const [email, setEmail] = useState('');  // Assuming email is needed here
  const [pass, setPass] = useState('');    // To store admin password


  // Handle Switch Change
  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setShowModal(event.target.checked);
    dispatchh(toggleData(isChecked));
    // console.log("Dispatched toggleData with: ", isChecked);
  };
  // const handleChange1 = (event) => {
  //   setSwitchState(event.target.checked);
  //   setShowModal(event.target.checked); // Show modal when switch is turned on
  // };

  // Handle Modal Close
  const handleClose = () => setShowModal(false);

  // Handle Password Submission
  const handlePasswordSubmit = async () => {
    const userString = localStorage.getItem('user');
    console.log("use data  code fixed...", userString);

    const user = JSON.parse(userString);
    console.log("this user code", user);

    const userPassword = user.password;
    console.log("this password code", userPassword);
    if (userPassword === password) {
      handleClose();
    } else {
      console.log("password is not matched....!");
      toast.warn('password do not match', {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
    }

  };

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {/* {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />} */}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex", // Use flex display to align content horizontally
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/UserDashboard")}
        >
          {/* Add padding to the right of the PersonIcon */}
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          {`Dashboard`}
        </Button>
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex", // Use flex display to align content horizontally
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/WhistleBlower")}
        >
          {/* Add padding to the right of the PersonIcon */}
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          {`Whistle Blower`}
        </Button>
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleToggleOptions}
        >
          {/* Add padding to the right of the PersonIcon */}
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          Users Management
          <ArrowDropDownIcon />
        </Button>
        {showOptions && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
              <NavLink to={"/dashboard"} key={"key"}>
                <SidenavCollapse
                  name={"Standard User"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
              <NavLink
                // key={key}
                to={"/NYSC"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"NYSC Member"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 12,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleProviders}
        >
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          <span style={{ paddingRight: "8px" }}>Service Agents</span>
          <ArrowDropDownIcon />
        </Button>
        {provider && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/provider"} key={"key"}>
                <SidenavCollapse
                  name={"Towing Service"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/AmbulamceProviders"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Ambulance Service"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 12,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleTrips}
        >
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          <span style={{ paddingRight: "8px" }}>Trip Monitor</span>
          <ArrowDropDownIcon />
        </Button>
        {trip && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/longdistance"} key={"key"}>
                <SidenavCollapse
                  name={"Long Distance Escort"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/shortdistance"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Short Distance Escort"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>

          </>
          // </Paper>
        )}
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleWellBeing}
        >
          {/* Add padding to the right of the CheckCircleIcon */}
          <span style={{ paddingRight: "24px" }}>
            <CheckCircleIcon />
          </span>
          WellBeing Check
          <ArrowDropDownIcon />
        </Button>
        {wellBeing && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/VirtualHomeCheck"} key={"key"}>
                <SidenavCollapse
                  name={"Virtual Home Check"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/WellbeingManagment"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Virtual Travel Guard"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/Wellbeing_SameVehicle_User"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"WSV USERS"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleOpenArmsList}
        >
          {/* Add padding to the right of the CheckCircleIcon */}
          <span style={{ paddingRight: "24px" }}>
            <CheckCircleIcon />
          </span>
          ASM
          <ArrowDropDownIcon />
        </Button>
        {armsList && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/SecurityArmsRequest"} key={"key"}>
                <SidenavCollapse
                  name={"ASR"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/SecurityArms"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"ASVM"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          // onClick={() => navigate("/notifications")}
          onClick={() => hanldeSosToggle()}
        >
          {/* Add space (margin) to the right of the NotificationsIcon */}
          <span style={{ marginRight: "24px" }}>
            <NotificationsIcon />
          </span>
          SOS NETWORK
        </Button>
        {SOS && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            {/* <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/notifications"} key={"key"}>
                <SidenavCollapse
                  name={"Today SOS"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/AllSos"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"All SOS "}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div> */}
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/webSocket"} key={"key"}>
                <SidenavCollapse
                  name={"Device Trigger"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/subs")}
        >
          {/* Add space (margin) to the right of the NotificationsIcon */}
          <span style={{ marginRight: "24px" }}>
            <PaymentIcon />
          </span>
          Subscription
        </Button>
      </div>
      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/recharge")}
        >
          {/* Add space (margin) to the right of the NotificationsIcon */}
          <span style={{ marginRight: "24px" }}>
            <PaymentIcon />
          </span>
          Recharge Cards
        </Button>
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleTriggers}
        >
          {/* Add padding to the right of the CheckCircleIcon */}
          <span style={{ paddingRight: "24px" }}>
            <NotificationsIcon />
          </span>
          Triggers
          <ArrowDropDownIcon />
        </Button>

        {triggers && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/ZonePassed"} key={"key"}>
                <SidenavCollapse
                  name={"Zone Passed"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/Batterylevels"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Battery levels"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}

        <div>
          <Button
            variant="text"
            style={{
              marginLeft: 0,
              marginBottom: 5,
              color: "white",
              backgroundColor: "transparent",
              fontSize: 11,
              display: "flex",
              alignItems: "center", // Center align the content vertically
            }}
            onClick={() => navigate("/PurchaseSMSCredits")}
          >
            {/* Add padding to the left (start) of the DriveEtaIcon */}
            <span style={{ paddingRight: "24px" }}>
              <PersonIcon />
            </span>
            Purchase SMS Credits
          </Button>
        </div>

        <div>
          <Button
            variant="text"
            style={{
              marginLeft: 0,
              marginBottom: 5,
              color: "white",
              backgroundColor: "transparent",
              fontSize: 11,
              display: "flex",
              alignItems: "center", // Center align the content vertically
            }}
            onClick={() => navigate("/Online_Offline_Users")}
          >
            {/* Add padding to the left (start) of the DriveEtaIcon */}
            <span style={{ paddingRight: "24px" }}>
              <PersonIcon />
            </span>
            Live location
          </Button>
        </div>

        <Button
          variant="text"
          style={{
            marginLeft: 0,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={handleSubList}
        >
          {/* Add padding to the right of the CheckCircleIcon */}
          <span style={{ paddingRight: "24px" }}>
            <GroupIcon />
          </span>
          Subcribers
          <ArrowDropDownIcon />
        </Button>

        {subList && (
          // <Paper elevation={1} style={{ marginTop: '1px', padding: '1px' }}>
          <>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink to={"/activeSub"} key={"key"}>
                <SidenavCollapse
                  name={"Active"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  }
                  // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 0 }}>
              <NavLink
                // key={key}
                to={"/nonActiveSub"}
                // href={"href"}
                key={"key"}
              // color={textColor}
              // target="_blank"
              // rel="noreferrer"
              // sx={{ textDecoratin: "none" }}
              >
                <SidenavCollapse
                  name={"Non Active"}
                  icon={
                    <SvgIcon fontSize="small">
                      <circle cx="12" cy="12" r="4" fill="white" />
                    </SvgIcon>
                  } // color={textColor}
                  active={false}
                  noCollapse={false}
                />
              </NavLink>
            </div>
          </>
          // </Paper>
        )}
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            marginBottom: 10,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/vehicle")}
        >
          {/* Add padding to the left (start) of the DriveEtaIcon */}
          <span style={{ paddingRight: "24px" }}>
            <DriveEtaIcon />
          </span>
          Vehicle
        </Button>
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            marginBottom: 10,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/ManageLogIn")}
        >
          {/* Add padding to the left (start) of the DriveEtaIcon */}
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          Manage LogIn
        </Button>
      </div>

      <div>
        <Button
          variant="text"
          style={{
            marginLeft: 0,
            marginBottom: 10,
            color: "white",
            backgroundColor: "transparent",
            fontSize: 11,
            display: "flex",
            alignItems: "center", // Center align the content vertically
          }}
          onClick={() => navigate("/ManageUsersPin")}
        >
          {/* Add padding to the left (start) of the DriveEtaIcon */}
          <span style={{ paddingRight: "24px" }}>
            <PersonIcon />
          </span>
          Manage Users Pin
        </Button>
      </div>

      <div style={{ display: "flex", alignItems: "center", alignSelf: "center", marginTop: 10 }}>
        <FormControlLabel
          control={<Switch checked={switchState} onChange={handleChange} name="allData" />}
          label=""
          style={{ marginRight: "16px" }} // Adjust the margin as needed
        />
        <span style={{ color: "white", fontSize: "16px" }}>
          {allData ? "Owner's Mode" : "Staff Mode"}
        </span>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Owner Mode</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Enter Your Password</label>
            <input
              type="password"
              className="form-control mt-2"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary" onClick={handlePasswordSubmit} >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <List>{renderRoutes}</List>
      <div className="ms-5 ps-4 mt-3">
        <button
          className="btn btn-danger ms-5 btn-sm w-50 ms-auto me-auto"
          onClick={() => handleLogout()}
        >
          logout
        </button>
      </div>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
