import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { red, purple, green, orange, yellow } from '@mui/material/colors';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Paper, Chip, Grid, Card, CircularProgress, Switch, FormControlLabel
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EmptyData from "components/EmptyData";

// Initialize Socket connection
const socket = io('http://localhost:4000/', {                //  http://api.itracknet.com/ https://node.websocket.karzame.org/  ,    http://localhost:4000/
  transports: ['websocket', 'polling'],
  withCredentials: true
});

const SocketClient = () => {
  const [status, setStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true); // Manage loading state
  const [searchTxt, setSearchText] = useState("");
  const [users, setUsers] = useState([]); // State to hold user data
  const [isOn, setIsOn] = useState(false);

  const handleToggle = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId
          ? { ...user, wellbeingcheck: !user.wellbeingcheck }
          : user
      )
    );
  };
  const sendMessage = () => {
    socket.emit('message', 'Hello from React!');
  };
  useEffect(() => {
    // Establish socket connection on component mount
    socket.on('connect', () => {
      setStatus('Connected');
      console.log("Connection established");
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected');
      console.log("Disconnected from server");
    });


    // Listen for socket messages and update state
    socket.on('message', (usersData) => {

      const formattedUsersData = usersData.map((user, index) => ({
        id: index + 1, // Use userId, fallback to a unique default ID if missing
        name: user.userName || 'Unknown User', // Fallback to 'Unknown User' if name is missing
        imageUrl: user.userImage || '/images/default.jpg', // Fallback to default image if userImage is missing
        onlineStatus: user.onlineStatus ? 'Online' : 'Offline', // Map boolean onlineStatus to 'Online' or 'Offline'
        isMoving: user.isMoving ? 'Moving' : 'Stopped', // Boolean to string representation
        wellbeingcheck: user.wellbeingcheck ? "On" : "Off",
        lastLocation: user.lastLocation ? user.userId : 'Location not available', // Link to Google Maps or fallback text
        tripStatus: user.tripStatus || 'No Status', // Fallback to 'No Status' if tripStatus is missing
        batteryLevel: user.batteryLevel ? user.batteryLevel : 'Unknown', // Show battery level or fallback
        phoneStatus: user.phoneStatus || 'Device Unknown', // Fallback if phoneStatus is not available
        geofenceStatus: user.geofenceStatus || 'Unknown', // Fallback for geofenceStatus
      }));

      // Display the formatted data in the console for verification
      console.log("Formatted Users Data:", formattedUsersData);

      // Example: Set formatted data into state if using React
      setUsers(formattedUsersData);


      // // Map data received from the socket to format it for the table
      // const formattedData = userName.map((name, index) => ({
      //   id: index + 1,
      //   name: name,
      //   imageUrl: userImg[index] || '/images/default.jpg', // Use default image if none provided
      //   battery: getUserBatteryDataInfo[index] || 'Unknown',
      //   phoneStatus: phoneStatus[index] || 'Device ON',
      //   timestamp: online_status[index] ? 'online' : "Off", // Replace with actual timestamp
      //   zoneFencing: getUserGeofencingStatus[index] || 'Not Detect', // Replace with actual data if available
      //   movementIndicator: getMovmentIndicator[index] ? "Moving" : "Stopped",
      //   lastLocation: userIds.map((res) => res[index]) || 'Trick', // Replace with actual data if available


      // }));

      // // Update users state with formatted data
      // setUsers(formattedData);
      // console.log("formatted data....", formattedData);

      setLoading(false); // Disable loading once data is received
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const naivgate = useNavigate();
  const allData = useSelector((state) => state.data.allData);

  //get data for select owner mode
  const getData = async () => {
    sendMessage();
  };
  //useEffect to get data 
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      naivgate("/authentication/sign-in");
    }
    getData();
  }, [allData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Chip Components for different statuses
  const BatteryStatusChip = ({ status }) => (
    <Chip
      label={status}
      style={{ backgroundColor: red[500], color: 'white' }}
      icon={<span style={{ color: red[500], fontSize: '12px' }}>●</span>}
    />
  );

  const PhoneStatusChip = ({ status }) => (
    <Chip
      label={status}
      style={{ backgroundColor: purple[500], color: 'white' }}
      icon={<span style={{ color: purple[500], fontSize: '12px' }}>●</span>}
    />
  );

  const TimestampChip = ({ status }) => (
    <Chip
      label={status}
      style={{ backgroundColor: orange[300], color: 'black' }}
      icon={<span style={{ color: orange[300], fontSize: '12px' }}>●</span>}
    />
  );

  const ZoneFencingChip = ({ status }) => (
    <Chip
      label={status}
      style={{ backgroundColor: green[500], color: 'white' }}
      icon={<span style={{ color: green[500], fontSize: '12px' }}>●</span>}
    />
  );

  const MovementIndicatorChip = ({ status }) => (
    <Chip
      label={status}
      style={{ backgroundColor: orange[500], color: 'white' }}
      icon={<span style={{ color: orange[500], fontSize: '12px' }}>●</span>}
    />
  );

  const GetTripStatusChip = ({ status }) => (
    <Chip
      label={status}
      style={{ backgroundColor: yellow[500], color: 'white' }}
      icon={<span style={{ color: yellow[500], fontSize: '12px' }}>●</span>}
    />
  );

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
                    Device Trigger Events
                  </MDTypography>
                </MDBox>
                {allData ? (<MDBox>
                  <TableContainer component={Paper}>
                    <Table aria-label="user table">
                      <TableHead>
                        <TableBody>

                          <TableCell>User Name</TableCell>
                          <TableCell align="center" >Battery Indicator</TableCell>
                          <TableCell align="center">Phone Status</TableCell>
                          <TableCell align="center">Location status</TableCell>
                          <TableCell align="center">Zone Fencing</TableCell>
                          <TableCell align="center">Movement Indicator</TableCell>
                          <TableCell align="center">Tracking</TableCell>
                          <TableCell align="center">UserFBK</TableCell>
                          <TableCell align="center">Last Known Location</TableCell>

                          {users.map((user) => (
                            <TableRow key={user.id} sx={{ height: 'auto' }}>
                              <TableCell sx={{ padding: '6px' }} component="th" scope="row">
                                <Avatar src={user.imageUrl} alt={user.name} style={{ marginRight: '10px' }} />
                                {user.name}
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <BatteryStatusChip status={user.batteryLevel} />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <PhoneStatusChip status={user.phoneStatus} />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <TimestampChip status={user.onlineStatus} />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <ZoneFencingChip status={user.geofenceStatus} />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <MovementIndicatorChip status={user.isMoving} />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={user.wellbeingcheck} // Controlled by wellbeingcheck
                                      onChange={() => handleToggle(user.lastLocation)} // Toggle function
                                      color="primary"
                                    />
                                  }
                                  label={user.wellbeingcheck ? 'User is ON' : 'User is OFF'} // Dynamic label based on wellbeingcheck
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>

                                <GetTripStatusChip status={user.tripStatus} />

                              </TableCell>
                              <TableCell align="center" sx={{ padding: '6px' }}>
                                <Link to={`/locate/${user.lastLocation}?userData=truck`}>
                                  <button className="btn btn-danger btn-sm" >Track</button> </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </TableHead>

                    </Table>
                  </TableContainer>
                </MDBox>
                ) : <EmptyData />}
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default SocketClient;
