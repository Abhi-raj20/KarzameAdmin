// import React, { useCallback,useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { red, purple, green, orange, yellow } from '@mui/material/colors';
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Avatar, Paper, Chip, Grid, Card, CircularProgress, Switch, FormControlLabel
// } from '@mui/material';
// import { useParams } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import EmptyData from "components/EmptyData";
// import { connectSocket, disconnectSocket, sendMessage } from './SocketService';
// import {
//   getDatabase,
//   ref,
//   onValue,
//   set,
//   get,
//   onChildAdded,
//   child,
//   update,
//   onChildChanged,
// } from "firebase/database";
// import { collection, getDocs, setDoc } from "firebase/firestore";
// import { db } from "../firebase";


// // Initialize Socket connection
// const socket = io('http://localhost:4000', {                //  http://api.itracknet.com/ https://node.websocket.karzame.org/  ,    http://ws.itracknet.com/
//   transports: ['websocket', 'polling'],
//   withCredentials: true
// });

// const SocketClient = () => {
//   const [status, setStatus] = useState('Connecting...');
//   const [loading, setLoading] = useState(true); // Manage loading state
//   const [searchTxt, setSearchText] = useState("");
//   const [users, setUsers] = useState([]); // State to hold user data
//   const [isOn, setIsOn] = useState(false);
//   const { userId, wellBeingCheckId } = useParams();
//   const [rows, setRows] = useState([]);

//   const handleToggle = async (userId) => {
//     console.log("this is handle asksds....");
    
//     setUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user.userId === userId ? { ...user, wellbeingcheck: !user.wellbeingcheck } : user
//       )
//     );

//     // Update the wellbeingcheck value in Firebase
    
    
   
//   };

//   const updateWellBeingServiceIsRead = useCallback((userId, wellBeingCheckId, newValue) => {
//     const db = getDatabase();
//     const wellBeingServiceRef = ref(db, `users/${userId}/wellBeingServicesData/${wellBeingCheckId}`);
  
//     // Update the isRead value in Firebase
//     update(wellBeingServiceRef, { isRead: newValue })
//       .then(() => {
//         console.log(`Successfully updated isRead to ${newValue}`);
//       })
//       .catch((error) => {
//         console.error("Error updating isRead value:", error);
//       });
//   }, []);
  
//   const getWellBeingServices = useCallback(() => {
//     const db = getDatabase();
//     const usersRef = ref(db, "users");
  
//     get(usersRef)
//       .then((snapshot) => {
//         setRows([]);
//         if (snapshot.exists()) {
//           const usersData = snapshot.val();
//           const usersWithWellBeingServices = [];
  
//           for (const userId in usersData) {
//             if (Object.hasOwnProperty.call(usersData, userId)) {
//               const user = usersData[userId];
//               const { userImage, latitude, longitude } = user;
  
//               if (user.wellBeingServicesData) {
//                 const wellBeingData = user.wellBeingServicesData;
  
//                 if (wellBeingData[wellBeingCheckId]) {
//                   const wellBeingServiceItem = wellBeingData[wellBeingCheckId];
//                   console.log("item of well being check", wellBeingServiceItem);
  
//                   const wellBeingServicesDataObject = {
//                     sr: 1,
//                     wellBeingService: wellBeingServiceItem.isRead,
//                   };
//                   usersWithWellBeingServices.push(wellBeingServicesDataObject);
  
//                   // Update the isRead value if needed
//                   if (wellBeingServiceItem.isRead === false) {
//                     updateWellBeingServiceIsRead(userId, wellBeingCheckId, true);
//                   }
//                 }
//               }
//             }
//           }
  
//           // setRows(usersWithWellBeingServices);
//           console.log(usersWithWellBeingServices);
//         } else {
//           console.log("No users found.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, [updateWellBeingServiceIsRead]);
  
//   useEffect(() => {
//     // Define handler functions
//     const onConnect = () => {
//       setStatus('Connected');
//       console.log("Connection established");
//     };

//     const onDisconnect = () => {
//       setStatus('Disconnected');
//       console.log("Disconnected from server");
//     };

//     const onMessage = (usersData) => {
//       console.log("usersData",usersData);
      
//       const formattedUsersData = usersData.map((user, index) => ({
//         id: index + 1,
//         name: user.userName || 'Unknown User',
//         imageUrl: user.userImage || '/images/default.jpg',
//         onlineStatus: user.onlineStatus ? 'Online' : 'Offline',
//         isMoving: user.isMoving ? 'Moving' : 'Stopped',
//         wellbeingcheck: user.wellbeingcheck === 'true' ? "On" : "Off",
//         lastLocation: user.lastLocation ? user.userId : 'Location not available',
//         tripStatus: user.tripStatus || 'No Status',
//         batteryLevel: user.batteryLevel ? user.batteryLevel : 'Unknown',
//         phoneStatus: user.phoneStatus || 'Device Unknown',
//         geofenceStatus: user.geofenceStatus || 'Unknown',
//       }));

//       setUsers(formattedUsersData);
//       setLoading(false);
//     };

//     // Connect to socket using the handlers
//     connectSocket(onConnect, onDisconnect, onMessage);

//     // Cleanup socket listeners on component unmount
//     return () => {
//       disconnectSocket();
//     };
//   }, []);

//   const navigate = useNavigate();
//   const allData = useSelector((state) => state.data.allData);

//   const getData = () => {
//     sendMessage('Hello from React!');
//   };

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   const handleSearchChange = (event) => {
//     setSearchText(event.target.value);
//   };

//   // Chip Components for different statuses
//   const BatteryStatusChip = ({ status }) => (
//     <Chip
//       label={status}
//       style={{ backgroundColor: red[500], color: 'white' }}
//       icon={<span style={{ color: red[500], fontSize: '12px' }}>●</span>}
//     />
//   );

//   const PhoneStatusChip = ({ status }) => (
//     <Chip
//       label={status}
//       style={{ backgroundColor: purple[500], color: 'white' }}
//       icon={<span style={{ color: purple[500], fontSize: '12px' }}>●</span>}
//     />
//   );

//   const TimestampChip = ({ status }) => (
//     <Chip
//       label={status}
//       style={{ backgroundColor: orange[300], color: 'black' }}
//       icon={<span style={{ color: orange[300], fontSize: '12px' }}>●</span>}
//     />
//   );

//   const ZoneFencingChip = ({ status }) => (
//     <Chip
//       label={status}
//       style={{ backgroundColor: green[500], color: 'white' }}
//       icon={<span style={{ color: green[500], fontSize: '12px' }}>●</span>}
//     />
//   );

//   const MovementIndicatorChip = ({ status }) => (
//     <Chip
//       label={status}
//       style={{ backgroundColor: orange[500], color: 'white' }}
//       icon={<span style={{ color: orange[500], fontSize: '12px' }}>●</span>}
//     />
//   );

//   const GetTripStatusChip = ({ status }) => (
//     <Chip
//       label={status}
//       style={{ backgroundColor: yellow[500], color: 'white' }}
//       icon={<span style={{ color: yellow[500], fontSize: '12px' }}>●</span>}
//     />
//   );

//   return (
//     <DashboardLayout>
//       <DashboardNavbar value={searchTxt} onChange={handleSearchChange} />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
//           {loading ? (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center", // Ensure horizontal centering
//               }}
//             >
//               Loading...
//             </div>
//           ) : (
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox
//                   mx={2}
//                   mt={-3}
//                   py={3}
//                   px={2}
//                   variant="gradient"
//                   bgColor="info"
//                   borderRadius="lg"
//                   coloredShadow="info"
//                 >
//                   <ToastContainer />
//                   <MDTypography variant="h6" color="white">
//                     Device Trigger Events
//                   </MDTypography>
//                 </MDBox>
//                 {allData ? (<MDBox>
//                   <TableContainer component={Paper}>
//                     <Table aria-label="user table">
//                       <TableHead>
//                         <TableBody>

//                           <TableCell>User Name</TableCell>
//                           <TableCell align="center" >Battery Indicator</TableCell>
//                           <TableCell align="center">Phone Status</TableCell>
//                           <TableCell align="center">Location status</TableCell>
//                           <TableCell align="center">Zone Fencing</TableCell>
//                           <TableCell align="center">Movement Indicator</TableCell>
//                           <TableCell align="center">Tracking</TableCell>
//                           <TableCell align="center">UserFBK</TableCell>
//                           <TableCell align="center">Last Known Location</TableCell>

//                           {users.map((user) => (
//                             <TableRow key={user.id} sx={{ height: 'auto' }}>
//                               <TableCell sx={{ padding: '6px' }} component="th" scope="row">
//                                 <Avatar src={user.imageUrl} alt={user.name} style={{ marginRight: '10px' }} />
//                                 {user.name}
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <BatteryStatusChip status={user.batteryLevel} />
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <PhoneStatusChip status={user.phoneStatus} />
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <TimestampChip status={user.onlineStatus} />
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <ZoneFencingChip status={user.geofenceStatus} />
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <MovementIndicatorChip status={user.isMoving} />
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <FormControlLabel
//                                   control={
//                                     <Switch
//                                       checked={user.wellbeingcheck} // Controlled by wellbeingcheck
//                                       onChange={() => handleToggle(user.lastLocation)} // Toggle function
//                                       color="primary"
//                                     />
//                                   }
//                                   label={user.wellbeingcheck ? 'User is ON' : 'User is OFF'} // Dynamic label based on wellbeingcheck
//                                 />
//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>

//                                 <GetTripStatusChip status={user.tripStatus} />

//                               </TableCell>
//                               <TableCell align="center" sx={{ padding: '6px' }}>
//                                 <Link to={`/locate/${user.lastLocation}?userData=truck`}>
//                                   <button className="btn btn-danger btn-sm" >Track</button> </Link>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </TableHead>

//                     </Table>
//                   </TableContainer>
//                 </MDBox>
//                 ) : <EmptyData />}
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// };

// export default SocketClient;


import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { red, purple, green, orange, yellow } from '@mui/material/colors';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Paper, Chip, Grid, Card, CircularProgress,  FormControlLabel,Switch
} from '@mui/material';
// import Switch from '@mui/joy/Switch';
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EmptyData from "components/EmptyData";
import { connectSocket, disconnectSocket, sendMessage } from './SocketService';
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  update,
} from "firebase/database";
import { db } from "../firebase";

// Initialize Socket connection
const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

const SocketClient = () => {
  const [status, setStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);
  const [searchTxt, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const { userId, wellBeingCheckId } = useParams();
  const [rows, setRows] = useState([]);

  // Define the updateWellBeingServiceIsRead function
  const updateWellBeingServiceIsRead = useCallback((userId, wellBeingCheckId, newValue) => {
    const db = getDatabase();
    const wellBeingServiceRef = ref(db, `users/${userId}/wellBeingServicesData/${wellBeingCheckId}`);
  
    // Update the isRead value in Firebase
    update(wellBeingServiceRef, { isRead: newValue })
      .then(() => {
        console.log(`Successfully updated isRead to ${newValue}`);
      })
      .catch((error) => {
        console.error("Error updating isRead value:", error);
      });
  }, []);

 // Handle toggle for wellbeingcheck
  const handleToggle = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Update the local state
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, wellbeingcheck: newStatus } : user
      )
    );

    // Emit the updated wellbeingcheck status to the backend
    socket.emit('toggleWellbeingcheck', { userId, wellbeingcheck: newStatus ? 'On' : 'Off' });

    // Update the wellbeingcheck in Firebase
    const db = getDatabase();
    const wellBeingServiceRef = ref(db, `users/${userId}/wellBeingServicesData/${wellBeingCheckId}`);
    try {
      await update(wellBeingServiceRef, { isRead: newStatus });
      console.log(`Successfully updated wellbeingcheck for user ${userId}`);
    } catch (error) {
      console.error('Error updating wellbeingcheck:', error);
    }
  };


  

  const getWellBeingServices = useCallback(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    get(usersRef)
      .then((snapshot) => {
        setRows([]);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersWithWellBeingServices = [];

          for (const userId in usersData) {
            if (Object.hasOwnProperty.call(usersData, userId)) {
              const user = usersData[userId];
              const { userImage, latitude, longitude } = user;

              if (user.wellBeingServicesData) {
                const wellBeingData = user.wellBeingServicesData;

                if (wellBeingData[wellBeingCheckId]) {
                  const wellBeingServiceItem = wellBeingData[wellBeingCheckId];
                  console.log("item of well being check", wellBeingServiceItem);

                  const wellBeingServicesDataObject = {
                    sr: 1,
                    wellBeingService: wellBeingServiceItem.isRead,
                  };
                  usersWithWellBeingServices.push(wellBeingServicesDataObject);

                  // Update the isRead value if needed
                  if (wellBeingServiceItem.isRead === false) {
                    updateWellBeingServiceIsRead(userId, wellBeingCheckId, true);
                  }
                }
              }
            }
          }

          // setRows(usersWithWellBeingServices);
          console.log(usersWithWellBeingServices);
        } else {
          console.log("No users found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [updateWellBeingServiceIsRead]);

  useEffect(() => {
    const onConnect = () => {
      setStatus('Connected');
      console.log("Connection established");
    };

    const onDisconnect = () => {
      setStatus('Disconnected');
      console.log("Disconnected from server");
    };

    const onMessage = (usersData) => {
      console.log("usersData", usersData);

      const formattedUsersData = usersData.map((user, index) => ({
        id: index + 1,
        name: user.userName || 'Unknown User',
        imageUrl: user.userImage || '/images/default.jpg',
        onlineStatus: user.onlineStatus ? 'Online' : 'Offline',
        isMoving: user.isMoving ? 'Moving' : 'Stopped',
        wellbeingcheck: user.wellbeingcheck === 'true' ? "On" : "Off",
        lastLocation: user.lastLocation ? user.userId : 'Location not available',
        tripStatus: user.tripStatus || 'No Status',
        batteryLevel: user.batteryLevel ? user.batteryLevel : 'Unknown',
        phoneStatus: user.phoneStatus || 'Device Unknown',
        geofenceStatus: user.geofenceStatus || 'Unknown',
      }));

      setUsers(formattedUsersData);
      setLoading(false);
    };

    connectSocket(onConnect, onDisconnect, onMessage);

    return () => {
      disconnectSocket();
    };
  }, []);

  const navigate = useNavigate();
  const allData = useSelector((state) => state.data.allData);

  const getData = () => {
    sendMessage('Hello from React!');
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/authentication/sign-in");
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
      style={{ backgroundColor: red[500], color: 'white' ,borderRadius: '5px', fontWeight: 'bold' }}
      icon={<span style={{ color: red[500], fontSize: '12px'}}>●</span>}
    />
  );

  const PhoneStatusChip = ({ status }) => {
    const getChipStyles1 = () => {
      if (status === 'Device ON') {
        return { 
          backgroundColor: green[500], 
          fontWeight: 'bold',
          color: 'white', 
          iconColor: green[500],
          borderRadius: '5px',
        }
      } else {
        return { 
          backgroundColor: red[500], 
          color: 'white', 
          fontWeight: 'bold',
          iconColor: red[500], 
          borderRadius: '5px',
        };
      }
    }
  
    const { backgroundColor, color, iconColor, borderRadius,fontWeight } = getChipStyles1();
  
    return (
      <Chip
        label={status}
        style={{ backgroundColor, color, borderRadius,fontWeight }}
        icon={<span style={{ color: iconColor, fontSize: '12px' }}>●</span>}
      />
    );
  };
 
  const TimestampChip = ({ status }) => {
    const getChipStyles2 = () => {
      if (status === 'Online') {
        return { 
          backgroundColor: green[500], 
          fontWeight: 'bold',
          color: 'white', 
          iconColor: green[500],
          borderRadius: '5px',
        }
      } else {
        return { 
          backgroundColor: red[500], 
          color: 'white', 
          fontWeight: 'bold',
          iconColor: red[500], 
          borderRadius: '5px',
        };
      }
    }
  
    const { backgroundColor, color, iconColor, borderRadius,fontWeight } = getChipStyles2();
  
    return (
      <Chip
        label={status}
        style={{ backgroundColor, color, borderRadius,fontWeight }}
        icon={<span style={{ color: iconColor, fontSize: '12px' }}>●</span>}
      />
    );

  };

  const ZoneFencingChip = ({ status }) => {
    const getChipStyles2 = () => {
      if (status === 'Inside Zone') {
        return { 
          backgroundColor: green[500], 
          fontWeight: 'bold',
          color: 'white', 
          iconColor: green[500],
          borderRadius: '5px',
        }
      } else {
        return { 
          backgroundColor: red[500], 
          color: 'white', 
          fontWeight: 'bold',
          iconColor: red[500], 
          borderRadius: '5px',
        };
      }
    }
  
    const { backgroundColor, color, iconColor, borderRadius,fontWeight } = getChipStyles2();
  
    return (
      <Chip
        label={status}
        style={{ backgroundColor, color, borderRadius,fontWeight }}
        icon={<span style={{ color: iconColor, fontSize: '12px' }}>●</span>}
      />
    );
};

  const MovementIndicatorChip = ({ status }) => {
    const getChipStyles2 = () => {
      if (status === 'Arrived') {
        return { 
          backgroundColor: green[500], 
          fontWeight: 'bold',
          color: 'white', 
          iconColor: green[500],
          borderRadius: '5px',
        }
      } else {
        return { 
          backgroundColor: red[500], 
          color: 'white', 
          fontWeight: 'bold',
          iconColor: red[500], 
          borderRadius: '5px',
        };
      }
    }
  
    const { backgroundColor, color, iconColor, borderRadius,fontWeight } = getChipStyles2();
  
    return (
      <Chip
        label={status}
        style={{ backgroundColor, color, borderRadius,fontWeight }}
        icon={<span style={{ color: iconColor, fontSize: '12px' }}>●</span>}
      />
    );
  };

  // const GetTripStatusChip = ({ status }) => (
  //   <Chip
  //   className="text-black"
  //     label={status}
  //     style={{ backgroundColor: yellow[500], color: 'white' }}
  //     icon={<span style={{ color: yellow[500], fontSize: '12px' }}>●</span>}
  //   />
  // );

  const GetTripStatusChip = ({ status }) => {
    // Determine background color, icon color, and text based on the status
    const getChipStyles = () => {
      if (status === 'Arrived') {
        return { 
          backgroundColor: "black", 
          fontWeight: 'bold',
          color: 'white', 
          iconColor: 'black', 
          text: 'Yes, we have arrived',
          borderRadius: '5px',
        };
      } else if (status === 'Moving') {
        return { 
          backgroundColor: red[500], 
          color: 'white', 
          iconColor: red[500], 
          fontWeight: 'bold',
          text: 'We are not stopping here',
          borderRadius: '5px',
        };
      } else {
        return { 
          backgroundColor: yellow[500], 
          color: 'white', 
          fontWeight: 'bold',
          iconColor: yellow[500], 
          text: 'No feedback',
          borderRadius: '5px',
        };
      }
    };
  
    const { backgroundColor, color, iconColor, text, borderRadius,fontWeight } = getChipStyles();
  
    return (
      <Chip
        label={text}
        style={{ backgroundColor, color, borderRadius,fontWeight }}
        icon={<span style={{ color: iconColor, fontSize: '12px' }}>●</span>}
      />
    );
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
                justifyContent: "center",
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
                  sx={{
                    textAlign: 'center', // Center text
                  }}
                >
                  <ToastContainer />
                  <MDTypography variant="h6" color="white" sx={{
      fontWeight: 'bold', // Make text bold
      fontSize: '1.5rem', // Adjust font size
    }} >
                    USERS DEVICE EVENTS DASHBOARD
                  </MDTypography>
                </MDBox>
                {allData ? (
                  <MDBox>
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
                                <TableCell align="center" className='rounded' sx={{ padding: '6px' }}>
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
                                <TableCell align="center" sx={{ padding: '6px',borderRadius :'5px' }}>
                                  <FormControlLabel
                                    control={
                                  
                                      <Switch
                                        checked={user.wellbeingcheck}
                                        onChange={() => handleToggle(user.userId, user.wellbeingcheck)}
                                        color="primary"
                                        borderRadius='5px'
                                      />
                                    }
                                    label={user.wellbeingcheck ? 'User is ON' : 'User is OFF'}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ padding: '6px' }}>
                                  <GetTripStatusChip  status={user.tripStatus} />
                                </TableCell>
                                <TableCell align="center" sx={{ padding: '6px' }}>
                                  <Link to={`/locate/${user.lastLocation}?userData=truck`}>
                                    <button className="btn btn-danger btn-sm">Track</button>
                                  </Link>
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
