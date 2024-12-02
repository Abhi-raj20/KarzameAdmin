// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, useJsApiLoader, Marker } from "@react-google-maps/api";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { Link, useNavigate } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { getCurrentAdminState } from "Utils/Functions";
// import Button from "@mui/material/Button";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useSelector } from "react-redux";
// import { useMediaQuery } from '@mui/material';

// function Online_Offline_Users() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",      //AIzaSyC0Bt5wwj03GVbGoBMwxVnhMvHllozt9fc
//   });
//   const [users, setUsers] = useState([]);
//   const allData = useSelector((state) => state.data.allData);
//   const [loading, setLoading] = useState(false);
//   const [onlineCount, setOnlineCount] = useState(0); // State to store the count of online users
//   const [offlineCount, setOfflineCount] = useState(0); // State to store the count of offline users
//   const [filter, setFilter] = useState(true); // State to store filter status, initialized to true for online users
//   const [stateName, setStateName] = useState("");
//   const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 }); // State to store map center
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   useEffect(() => {
//     fetchCoordinates();
//   }, [users, stateName, mapCenter]);

//   const fetchCoordinates = async () => {
//     try {

//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//           stateName
//         )}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`    //AIzaSyC2oEK5eAlXZ75c4-c_sKl_IZD7ZTsdI-E
//       );

//       const data = await response.json();
//       if (data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry.location;
//         setMapCenter({ lat: lat, lng: lng });
//       } else {
//         console.log("Coordinates not found for the state:", stateName);
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//     }
//   };

//   useEffect(() => {
//     if (users.length > 0) {
//       // Calculate center and zoom level based on filtered users' coordinates
//       calculateMapCenter();
//     }
//   }, [filter, users, mapCenter]);

//   const getData = async () => {
//     setLoading(true);

//     try {
//       const database = getDatabase();
//       const usersRef = ref(database, "/users");

//       const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city
//       setStateName(currentAdminState);
//       get(usersRef)
//         .then((snapshot) => {
//           const usersData = snapshot.val();
//           const usersArray = [];
//           let onlineCount = 0;
//           let offlineCount = 0;

//           for (const userId in usersData) {
//             if (usersData.hasOwnProperty(userId)) {
//               const user = usersData[userId];

//               // Check if the user's state matches the current admin's state
//               if (
//                 user.userState &&
//                 (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
//               ) {
//                 usersArray.push(user);
//                 if (user.isActive) {
//                   onlineCount++;
//                 } else {
//                   offlineCount++;
//                 }
//               }
//             }
//           }

//           setUsers(usersArray);
//           setOnlineCount(onlineCount);
//           setOfflineCount(offlineCount);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error getting data: ", error);
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   // Function to filter users based on isActive status
//   const handleFilter = (status) => {
//     if (status === "online") {
//       setFilter(true);
//     } else if (status === "offline") {
//       setFilter(false);
//     }
//   };

//   // Calculate center based on filtered users' coordinates
//   const calculateMapCenter = () => {
//     const filteredUsers =
//       filter === null ? users : users.filter((user) => user.isActive === filter);

//     if (filteredUsers.length === 0) {
//       setMapCenter({ lat: 0, lng: 0 });
//       return;
//     }

//     let sumLat = 0;
//     let sumLng = 0;

//     filteredUsers.forEach((user) => {
//       sumLat += user.Latitude;
//       sumLng += user.Longitude;
//     });

//     const centerLat = sumLat / filteredUsers.length;
//     const centerLng = sumLng / filteredUsers.length;

//     setMapCenter({ lat: centerLat, lng: centerLng });
//   };

//   const isLargeScreen = useMediaQuery('(min-width:1200px)');
//   const mapStyles = {
//      height: isLargeScreen ? '550px' : '400px',  // Larger height for large screens
//     width: "100%",
//   };

//   if (!isLoaded) {
//     return (
//       <div
//         style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
//       >
//         <h1>Loading the map...</h1>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//     <DashboardNavbar />
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
//               Loading the map...
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
//                   <MDTypography variant="h6" color="white">
//                     Live location
//                   </MDTypography>
//                 </MDBox>
//                 <MDBox pt={3}>
//                   <div style={{ marginLeft: 10, marginBottom: 10 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleFilter("online")}
//                       style={{
//                         backgroundColor: filter === true ? "green" : "gray",
//                         color: filter === true ? "white" : "black",
//                       }}
//                     >
//                       Online ({onlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: filter === false ? "red" : "gray",
//                         color: filter === false ? "white" : "black",
//                       }}
//                     >
//                       Offline ({offlineCount})
//                     </Button>
//                   </div>

//                   <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={mapCenter}>
//                     {users.map((user) => (
//                       <Marker
//                         key={user.id}
//                         position={{ lat: user.Latitude, lng: user.Longitude }}
//                       />
//                     ))}
//                   </GoogleMap>
//                 </MDBox>
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Online_Offline_Users;

// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, useJsApiLoader, Marker } from "@react-google-maps/api";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { Link, useNavigate } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { getCurrentAdminState } from "Utils/Functions";
// import Button from "@mui/material/Button";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useSelector } from "react-redux";
// import { useMediaQuery } from '@mui/material';

// function Online_Offline_Users() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",      //AIzaSyC0Bt5wwj03GVbGoBMwxVnhMvHllozt9fc
//   });
//   const [users, setUsers] = useState([]);
//   const allData = useSelector((state) => state.data.allData);
//   const [loading, setLoading] = useState(false);
//   const [onlineCount, setOnlineCount] = useState(0); // State to store the count of online users
//   const [offlineCount, setOfflineCount] = useState(0); // State to store the count of offline users
//   const [shortDistanceCount, setShortDistanceCount] = useState(5); // State to store the count of offline users
//   const [longDistanceCount, setLongDistanceCount] = useState(4); // State to store the count of offline users
//   const [virtualHomeCheckCount, setVirtualHomeCheckCount] = useState(2); // State to store the count of offline users
//   const [virtualTravelGuardCount, setVirtualTravelGuardCount] = useState(2); // State to store the count of offline users
//   const [filter, setFilter] = useState(true); // State to store filter status, initialized to true for online users
//   const [stateName, setStateName] = useState("");
//   const [mapCenter, setMapCenter] = useState({ lat: 9.0820, lng: 8.6753 }); // Center Nigeria
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   useEffect(() => {
//     fetchCoordinates();
//   }, [users, stateName, mapCenter]);

//   const fetchCoordinates = async () => {
//     try {

//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//           stateName
//         )}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`    //AIzaSyC2oEK5eAlXZ75c4-c_sKl_IZD7ZTsdI-E
//       );

//       const data = await response.json();
//       if (data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry.location;
//         setMapCenter({ lat: lat, lng: lng });
//       } else {
//         console.log("Coordinates not found for the state:", stateName);
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//     }
//   };

//   useEffect(() => {
//     if (users.length > 0) {
//       // Calculate center and zoom level based on filtered users' coordinates
//       calculateMapCenter();
//     }
//   }, [filter, users, mapCenter]);

//   const getData = async () => {
//     setLoading(true);
//     console.log("getdata....................");

//     try {
//       const database = getDatabase();
//       const usersRef = ref(database, "/users");

//       const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city
//       setStateName(currentAdminState);
//       get(usersRef)
//         .then((snapshot) => {
//           const usersData = snapshot.val();
//           const usersArray = [];
//           let onlineCount = 0;
//           let offlineCount = 0;
//           let shortdistance = 0;
//           let longdistance = 0;
//           let virtualTravelGuard = 0;
//           let virtualHomeCheck = 0;

//           for (const userId in usersData) {
//             if (usersData.hasOwnProperty(userId)) {
//               const user = usersData[userId];
//               console.log("userId......................");

//               // Check if the user's state matches the current admin's state
//               if (
//                 user.userState &&
//                 (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
//               ) {
//                 usersArray.push(user);
//                 if (user.isActive) {
//                   onlineCount++;
//                 } else {
//                   offlineCount++;
//                 }

//                 console.log("user data is this :....");

//               }
//             }
//           }

//           setUsers(usersArray);
//           setOnlineCount(onlineCount);
//           setOfflineCount(offlineCount);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error getting data: ", error);
//           setLoading(false);
//           console.log('errort.......................');

//         });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//       console.log('error.......................');

//     }
//   };

//   // Function to filter users based on isActive status
//   const handleFilter = (status) => {
//     if (status === "online") {
//       setFilter(true);
//     } else if (status === "offline") {
//       setFilter(false);
//     }
//   };

//   // Calculate center based on filtered users' coordinates
//   const calculateMapCenter = () => {
//     const filteredUsers =
//       filter === null ? users : users.filter((user) => user.isActive === filter);

//     if (filteredUsers.length === 0) {
//       setMapCenter({ lat: 0, lng: 0 });
//       return;
//     }

//     let sumLat = 0;
//     let sumLng = 0;

//     filteredUsers.forEach((user) => {
//       sumLat += user.Latitude;
//       sumLng += user.Longitude;
//     });

//     const centerLat = sumLat / filteredUsers.length;
//     const centerLng = sumLng / filteredUsers.length;

//     setMapCenter({ lat: centerLat, lng: centerLng });
//   };

//   const isLargeScreen = useMediaQuery('(min-width:1200px)');
//   const mapStyles = {
//      height: isLargeScreen ? '550px' : '400px',  // Larger height for large screens
//     width: "100%",
//   };

//   if (!isLoaded) {
//     return (
//       <div
//         style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
//       >
//         <h1>Loading the map...</h1>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//     <DashboardNavbar />
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
//               Loading the map...
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
//                   <MDTypography variant="h6" color="white">
//                     Live location
//                   </MDTypography>
//                 </MDBox>
//                 <MDBox pt={3}>
//                   <div style={{ marginLeft: 10, marginBottom: 10 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleFilter("online")}
//                       style={{
//                         backgroundColor: filter === true ? "green" : "gray",
//                         color: filter === true ? "white" : "black",
//                       }}
//                     >
//                       Online ({onlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: filter === false ? "red" : "gray",
//                         color: filter === false ? "white" : "black",
//                       }}
//                     >
//                       Offline ({offlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       // onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: filter === false ? "gray" : "red",
//                         color: filter === false ? "black" : "white",
//                       }}
//                     >
//                       Short Trip distance ({offlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       // onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: filter === false ? "red" : "#034f2c",
//                         color: filter === false ? "white" : "black",
//                       }}
//                     >
//                       Long Trip distance ({offlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       // onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: filter === false ? "red" : "#198754",
//                         color: filter === false ? "white" : "white",
//                       }}
//                     >
//                       Virtual Travel Guard ({offlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       // onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: filter === false ? "red" : "#7d7417",
//                         color: filter === false ? "white" : "black",
//                       }}
//                     >
//                       Virtual Home Check ({offlineCount})
//                     </Button>
//                   </div>

//                   <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={mapCenter}>
//                     {users.map((user) => (
//                       <Marker
//                         key={user.id}
//                         position={{ lat: user.Latitude, lng: user.Longitude }}
//                       />
//                     ))}
//                   </GoogleMap>
//                 </MDBox>
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Online_Offline_Users;

// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, useJsApiLoader, Marker } from "@react-google-maps/api";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { Link, useNavigate } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { getCurrentAdminState } from "Utils/Functions";
// import Button from "@mui/material/Button";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useSelector } from "react-redux";
// import { useMediaQuery } from '@mui/material';

// function Online_Offline_Users() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     //     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",      //AIzaSyC0Bt5wwj03GVbGoBMwxVnhMvHllozt9fc

//     //id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
//   });
//   const [users, setUsers] = useState([]);
//   const allData = useSelector((state) => state.data.allData);
//   const [loading, setLoading] = useState(false);
//   const [onlineCount, setOnlineCount] = useState(0);
//   const [offlineCount, setOfflineCount] = useState(0);
//   const [shortDistanceCount, setShortDistanceCount] = useState(0);
//   const [longDistanceCount, setLongDistanceCount] = useState(0);
//   const [virtualHomeCheckCount, setVirtualHomeCheckCount] = useState(0);
//   const [virtualTravelGuardCount, setVirtualTravelGuardCount] = useState(0);
//   const [filter, setFilter] = useState(true);
//   const [stateName, setStateName] = useState("");
//   const [mapCenter, setMapCenter] = useState({ lat: 9.0820, lng: 8.6753 });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   useEffect(() => {
//     fetchCoordinates();
//   }, [users, stateName, mapCenter]);

//   const fetchCoordinates = async () => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stateName)}&key=YOUR_GOOGLE_MAPS_API_KEY`
//       );
//       const data = await response.json();
//       if (data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry.location;
//         setMapCenter({ lat, lng });
//       } else {
//         console.log("Coordinates not found for the state:", stateName);
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//     }
//   };

//   useEffect(() => {
//     if (users.length > 0) {
//       calculateMapCenter();
//     }
//   }, [filter, users, mapCenter]);

//   const getData = async () => {
//     setLoading(true);

//     try {
//       const database = getDatabase();
//       const usersRef = ref(database, "/users");
//       const currentAdminState = await getCurrentAdminState();
//       setStateName(currentAdminState);

//       get(usersRef)
//         .then((snapshot) => {
//           const usersData = snapshot.val();
//           const usersArray = [];
//           let onlineCount = 0;
//           let offlineCount = 0;
//           let shortDistanceCount = 0;
//           let longDistanceCount = 0;
//           let virtualHomeCheckCount = 0;
//           let virtualTravelGuardCount = 0;

//           for (const userId in usersData) {
//             if (usersData.hasOwnProperty(userId)) {
//               const user = usersData[userId];
//               if (user.userState && (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())) {
//                 usersArray.push(user);
//                 if (user.isActive) onlineCount++;
//                 else offlineCount++;

//                 // Count trip types
//                 // Combine Short Distance Trips
//                 for (const shortKey in user) {
//                   const shortTrip = user[shortKey];
//                   console.log("short trip...",shortTrip);

//                 }

//                 if (user.tripType === "short_distance") shortDistanceCount++;
//                 if (user.tripType === "long_distance") longDistanceCount++;
//                 if (user.tripType === "virtual_home_check") virtualHomeCheckCount++;
//                 if (user.tripType === "virtual_travel_guard") virtualTravelGuardCount++;
//               }
//             }
//           }
//           setUsers(usersArray);
//           setOnlineCount(onlineCount);
//           setOfflineCount(offlineCount);
//           setShortDistanceCount(shortDistanceCount);
//           setLongDistanceCount(longDistanceCount);
//           setVirtualHomeCheckCount(virtualHomeCheckCount);
//           setVirtualTravelGuardCount(virtualTravelGuardCount);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error getting data: ", error);
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   const handleFilter = (status) => {
//     setFilter(status === "online");
//   };

//   const calculateMapCenter = () => {
//     const filteredUsers = filter === null ? users : users.filter((user) => user.isActive === filter);
//     if (filteredUsers.length === 0) {
//       setMapCenter({ lat: 0, lng: 0 });
//       return;
//     }
//     let sumLat = 0;
//     let sumLng = 0;
//     filteredUsers.forEach((user) => {
//       sumLat += user.Latitude;
//       sumLng += user.Longitude;
//     });
//     setMapCenter({ lat: sumLat / filteredUsers.length, lng: sumLng / filteredUsers.length });
//   };

//   const isLargeScreen = useMediaQuery('(min-width:1200px)');
//   const mapStyles = { height: isLargeScreen ? '550px' : '400px', width: "100%" };

//   if (!isLoaded) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
//         <h1>Loading the map...</h1>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
//           {loading ? (
//             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
//               Loading the map...
//             </div>
//           ) : (
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
//                   <MDTypography variant="h6" color="white">Live location</MDTypography>
//                 </MDBox>
//                 <MDBox pt={3}>
//                   <div style={{ marginLeft: 10, marginBottom: 10 }}>
//                     <Button variant="contained" onClick={() => handleFilter("online")} style={{ backgroundColor: filter ? "green" : "gray", color: filter ? "white" : "black" }}>
//                       Online ({onlineCount})
//                     </Button>
//                     <Button variant="contained" onClick={() => handleFilter("offline")} style={{ marginLeft: 6, backgroundColor: !filter ? "red" : "gray", color: !filter ? "white" : "black" }}>
//                       Offline ({offlineCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#034f2c", color: "white" }}>
//                       Short Trip Distance ({shortDistanceCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#198754", color: "white" }}>
//                       Long Trip Distance ({longDistanceCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#7d7417", color: "black" }}>
//                       Virtual Home Check ({virtualHomeCheckCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#198754", color: "white" }}>
//                       Virtual Travel Guard ({virtualTravelGuardCount})
//                     </Button>
//                   </div>
//                   <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={mapCenter}>
//                     {users.map((user) => (
//                       <Marker key={user.id} position={{ lat: user.Latitude, lng: user.Longitude }} />
//                     ))}
//                   </GoogleMap>
//                 </MDBox>
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Online_Offline_Users;

// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, useJsApiLoader, Marker,InfoWindow } from "@react-google-maps/api";
// // import { GoogleMap, LoadScript, Marker,  } from "@react-google-maps/api";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { Link, useNavigate } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { getCurrentAdminState } from "Utils/Functions";
// import Button from "@mui/material/Button";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useSelector } from "react-redux";
// import { useMediaQuery } from "@mui/material";

// function Online_Offline_Users() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
//   });
//   const [users, setUsers] = useState([]);
//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const allData = useSelector((state) => state.data.allData);
//   const [loading, setLoading] = useState(false);
//   const [onlineCount, setOnlineCount] = useState(0);
//   const [offlineCount, setOfflineCount] = useState(0);
//   const [shortDistanceCount, setShortDistanceCount] = useState(0);
//   const [longDistanceCount, setLongDistanceCount] = useState(0);
//   const [virtualHomeCheckCount, setVirtualHomeCheckCount] = useState(0);
//   const [virtualTravelGuardCount, setVirtualTravelGuardCount] = useState(0);
//   const [filter, setFilter] = useState(true);
//   const [stateName, setStateName] = useState("");
//   const [mapCenter, setMapCenter] = useState({ lat: 9.0820, lng: 8.6753 });
//   const navigate = useNavigate();
//   const isLargeScreen = useMediaQuery("(min-width:1200px)");
//   const mapStyles = { height: isLargeScreen ? "550px" : "400px", width: "100%" };

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   useEffect(() => {
//     fetchCoordinates();
//   }, [users, stateName, mapCenter]);

//   const fetchCoordinates = async () => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stateName)}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`
//       );
//       const data = await response.json();
//       if (data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry.location;
//         setMapCenter({ lat, lng });
//       } else {
//         console.log("Coordinates not found for the state:", stateName);
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//     }
//   };

//   const getData = async () => {
//     setLoading(true);
//     try {
//       const database = getDatabase();
//       const usersRef = ref(database, "/users");
//       const currentAdminState = await getCurrentAdminState();
//       setStateName(currentAdminState);

//       get(usersRef)
//         .then((snapshot) => {
//           const usersData = snapshot.val();
//           const usersArray = [];
//           let onlineCount = 0;
//           let offlineCount = 0;
//           let shortDistanceCount = 0;
//           let longDistanceCount = 0;
//           let virtualHomeCheckCount = 0;
//           let virtualTravelGuardCount = 0;

//           for (const userId in usersData) {
//             if (usersData.hasOwnProperty(userId)) {
//               const user = usersData[userId];
//               if (user.userState && (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())) {
//                 usersArray.push(user);
//                 if (user.isActive) onlineCount++;
//                 else offlineCount++;

//                 if (user.tripType === "short_distance") shortDistanceCount++;
//                 if (user.tripType === "long_distance") longDistanceCount++;
//                 if (user.tripType === "virtual_home_check") virtualHomeCheckCount++;
//                 if (user.tripType === "virtual_travel_guard") virtualTravelGuardCount++;
//               }
//             }
//           }
//           setUsers(usersArray);
//           setOnlineCount(onlineCount);
//           setOfflineCount(offlineCount);
//           setShortDistanceCount(shortDistanceCount);
//           setLongDistanceCount(longDistanceCount);
//           setVirtualHomeCheckCount(virtualHomeCheckCount);
//           setVirtualTravelGuardCount(virtualTravelGuardCount);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error getting data: ", error);
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   const handleFilter = (status) => {
//     setFilter(status === "online");
//   };

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
//           {loading ? (
//             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
//               Loading the map...
//             </div>
//           ) : (
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
//                   <MDTypography variant="h6" color="white">Live location</MDTypography>
//                 </MDBox>
//                 <MDBox pt={3}>
//                   <div style={{ marginLeft: 10, marginBottom: 10 }}>
//                     <Button variant="contained" onClick={() => handleFilter("online")} style={{ backgroundColor: filter ? "green" : "gray", color: filter ? "white" : "black" }}>
//                       Online ({onlineCount})
//                     </Button>
//                     <Button variant="contained" onClick={() => handleFilter("offline")} style={{ marginLeft: 6, backgroundColor: !filter ? "red" : "gray", color: !filter ? "white" : "black" }}>
//                       Offline ({offlineCount})
//                     </Button>
//                   </div>
//                   <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={mapCenter}>
//                     {users.map((user) => (
//                       <Marker
//                         key={user.id}
//                         position={{ lat: user.Latitude, lng: user.Longitude }}
//                         onClick={() => setSelectedMarker(user)}
//                       />
//                     ))}
//                     {selectedMarker && (
//                       <InfoWindow
//                         position={{ lat: selectedMarker.Latitude, lng: selectedMarker.Longitude }}
//                         onCloseClick={() => setSelectedMarker(null)}
//                       >
//                         <div>
//                           <h4>{selectedMarker.name}</h4>
//                           <p>Trip Type: {selectedMarker.tripType}</p>
//                         </div>
//                       </InfoWindow>
//                     )}
//                   </GoogleMap>
//                 </MDBox>
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Online_Offline_Users;

import React, { useEffect, useState,useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { getCurrentAdminState } from "Utils/Functions";
import Button from "@mui/material/Button";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { Box, TextField, Avatar, Dialog, DialogContent } from "@mui/material";

function Online_Offline_Users() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg", // Replace with the new API key
  });

  const [users, setUsers] = useState([]);
  const allData = useSelector((state) => state.data.allData);
  const [loading, setLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [shortDistanceCount, setShortDistanceCount] = useState(0);
  const [longDistanceCount, setLongDistanceCount] = useState(0);
  const [virtualHomeCheckCount, setVirtualHomeCheckCount] = useState(0);
  const [virtualTravelGuardCount, setVirtualTravelGuardCount] = useState(0);
  const [filter, setFilter] = useState(true);
  const [stateName, setStateName] = useState("");
  const [startTripLocation, setStartTripLocation] = useState([]);
  const [endTripLocation, setEndTripLocation] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 9.082, lng: 8.6753 });
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [open, setOpen] = useState(false);
  const [tripArray,setTripArray] = useState([]);
  const [newTripArray, setNewTripArray] = useState([]); // Store only new entries
  
  const previousDataRef = useRef([]); // Ref to store the previous state of the array

  const handleClickOpen = (user) => {
    console.log("userdata...", user);

    setUserInfo(user);
    setOpen(true);
  };

  // const handleShortDistance = (userInfo) = {
  //   userInfor.shortDistance
  // }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/authentication/sign-in");
    }
    getData();
  }, [allData]);

  useEffect(() => {
    if (stateName) {
      fetchCoordinates();
    }
  }, [stateName]); // Only run when `stateName` changes

  const fetchCoordinates = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          stateName
        )}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setMapCenter({ lat, lng });
      } else {
        console.log("Coordinates not found for the state:", stateName);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    calculateMapCenter();
  }, [filter, users]); // Removed `mapCenter` from dependencies

  const checkArray = async () => {
    try {
      const database = getDatabase();
      const usersRef = ref(database, "/users");
      const currentAdminState = await getCurrentAdminState();
      setStateName(currentAdminState);
  
      get(usersRef).then((snapshot) => {
        const usersData = snapshot.val();
  
        for (const userId in usersData) {
          if (usersData.hasOwnProperty(userId)) {
            const user = usersData[userId];
  
            if (
              user.userState &&
              (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
            ) {
              if (user.ShortDistance_Escort != null) {
                const shortDistanceInfo = user.ShortDistance_Escort;

                
                // const newArray = [...tripArray, shortDistanceInfo]; // Add new data
                setTripArray(shortDistanceInfo);
                console.log("this is a shortDistance Data...",shortDistanceInfo);
                
//   if(ShortDistanceArray != null) {
//     // Create a Set of IDs from array2 for quick lookup
// const idsInArray2 = new Set(ShortDistanceArray.map((item) => item.id));
//     const updatedArray2 = [
//       ...array2,
//       ...array1.filter((item) => !idsInArray2.has(item.id)),
//     ];
//   }            // Filter and add new items



                // Filter only new entries not present in previousDataRef 
        // const newEntries = freshData.filter(
        //   (item) => !previousDataRef.current.has(JSON.stringify(item))
        // );
  
        // // Add new entries to the tracked Set and update states
        // newEntries.forEach((entry) =>
        //   previousDataRef.current.add(JSON.stringify(entry))
        // );
  
        // if (newEntries.length > 0) {
        //   setNewTripArray(newEntries); // Store new entries in a separate state
        //   setTripArray((prev) => [...prev, ...newEntries]); // Append new entries to tripArray
        // }
      



                for (const shortdisdata in shortDistanceInfo) {
                  const short_distance = shortDistanceInfo[shortdisdata];
                  console.log("short distance data....1", short_distance);
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
  

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("tripArray me length ko check kare.....",tripArray.length);
      // console.log("tripArray me data ko check kare.....",tripArray);
      if (tripArray.length > previousDataRef.current.length) {
        // New object detected
        const newObject = tripArray[tripArray.length - 1];
        setUserInfo(newObject); // Set new object data for the dialog
        console.log("tripArray me data ko check kare.....",tripArray);
        
        setOpen(true); // Open the dialog
      }
      checkArray();
      // Update the ref with the current data
      previousDataRef.current = tripArray;
    }, 2000); // Check every 2 seconds
  
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [tripArray]);
  

  // const checkArray = async () => {
  //   try {
  //     const database = getDatabase();
  //     const usersRef = ref(database, "/users");
  //     const currentAdminState = await getCurrentAdminState();
  //     setStateName(currentAdminState);
  
  //     get(usersRef).then((snapshot) => {
  //       const usersData = snapshot.val();
  //       const freshData = []; // Temporary array for current fetch
  
  //       for (const userId in usersData) {
  //         if (usersData.hasOwnProperty(userId)) {
  //           const user = usersData[userId];
  
  //           if (
  //             user.userState &&
  //             (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
  //           ) {
  //             if (user.ShortDistance_Escort != null) {
  //               const shortDistanceInfo = user.ShortDistance_Escort;
  //               setTripArray(shortDistanceInfo);
  //               for (const shortdisdata in shortDistanceInfo) {
  //                 const short_distance = shortDistanceInfo[shortdisdata];
  //                 console.log("short distance data....1", short_distance);
  //                 freshData.push(short_distance);
  //               }
  //             }
  //           }
  //         }
  //       }
  
  //       // Filter only new entries not present in previousDataRef
  //       const newEntries = freshData.filter(
  //         (item) => !previousDataRef.current.has(JSON.stringify(item))
  //       );
  
  //       // Add new entries to the tracked Set and update states
  //       newEntries.forEach((entry) =>
  //         previousDataRef.current.add(JSON.stringify(entry))
  //       );
  
  //       if (newEntries.length > 0) {
  //         setNewTripArray(newEntries); // Store new entries in a separate state
  //         setTripArray((prev) => [...prev, ...newEntries]); // Append new entries to tripArray
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("Checking tripArray length:", tripArray.length);
  
  //     if (newTripArray.length > 0) {
  //       // Open dialog with the first new entry
  //       const newObject = newTripArray[0];
  //       setUserInfo(newObject); // Set dialog data
  //       setOpen(true); // Open dialog
  //       setNewTripArray([]); // Clear the newTripArray after processing
  //     }
  
  //     checkArray();
  //   }, 2000); // Check every 2 seconds
  
  //   return () => clearInterval(interval); // Cleanup on component unmount
  // }, [newTripArray]);
  
  
  const getData = async () => {
    setLoading(true);
    try {
      const database = getDatabase();
      const usersRef = ref(database, "/users");
      const currentAdminState = await getCurrentAdminState();
      setStateName(currentAdminState);

      get(usersRef)
        .then((snapshot) => {
          const usersData = snapshot.val();
          const usersArray = [];
          let onlineCount = 0;
          let offlineCount = 0;
          let shortDistanceCount = 0;
          let longDistanceCount = 0;
          let virtualHomeCheckCount = 0;
          let virtualTravelGuardCount = 0;

          for (const userId in usersData) {
            if (usersData.hasOwnProperty(userId)) {
              const user = usersData[userId];
              console.log("user dayta 1245....", user);

              if (
                user.userState &&
                (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
              ) {
                usersArray.push({ ...user, id: userId });
                if (user.isActive) onlineCount++;
                else offlineCount++;

                if (user.ShortDistance_Escort != null) {
                  const shortDistanceInfo = user.ShortDistance_Escort;
                  for (const shortdisdata in shortDistanceInfo) {
                    const short_distance = shortDistanceInfo[shortdisdata];
                    console.log("short distance data....1", short_distance);
                    if (short_distance.Trip_Status != null) {
                      const userlat = short_distance.Latitude;
                      const userlog = short_distance.Longitude;
                      startTripLocation.push({ userlat, userlog });
                      console.log("starttriplocation.....", startTripLocation);

                      const stopinfo = short_distance.stop;
                      for (const stopdata in stopinfo) {
                        const stop_data = stopinfo[stopdata];
                        const endlat = stop_data.stopLatitude;
                        const endlog = stop_data.stopLongitude;
                        endTripLocation.push({ endlat, endlog });
                        console.log("endTriplocation...", endTripLocation);
                      }
                      shortDistanceCount++;
                    }

                    //  if(short_distance.)
                  }
                }
                if (user.UserTour != null) {
                  const userTourInfo = user.UserTour;
                  for (const usertour in userTourInfo) {
                    const long_distance = userTourInfo[usertour];
                    console.log("short distance data....1", long_distance);
                    longDistanceCount++;

                    //  if(short_distance.)
                  }
                }

                if (user.VirtualHomeCheck != null) {
                  const virtualHomecheckInfo = user.VirtualHomeCheck;
                  for (const data in virtualHomecheckInfo) {
                    const virtualHome = virtualHomecheckInfo[data];
                    // console.log("short distance data....1",long_distance);
                    virtualHomeCheckCount++;

                    //  if(short_distance.)
                  }
                }

                if (user.wellBeingServicesData != null) {
                  const welBeingServicesInfo = user.wellBeingServicesData;
                  for (const data in welBeingServicesInfo) {
                    const virtualHome = welBeingServicesInfo[data];
                    // console.log("short distance data....1",long_distance);
                    virtualTravelGuardCount++;

                    //  if(short_distance.)
                  }
                }

                // if (user.tripType === "long_distance") longDistanceCount++;
                // if (user.tripType === "virtual_home_check") virtualHomeCheckCount++;
                // if (user.tripType === "virtual_travel_guard") virtualTravelGuardCount++;
              }
            }
          }
          setUsers(usersArray);
          setOnlineCount(onlineCount);
          setOfflineCount(offlineCount);
          setShortDistanceCount(shortDistanceCount);
          setLongDistanceCount(longDistanceCount);
          setVirtualHomeCheckCount(virtualHomeCheckCount);
          setVirtualTravelGuardCount(virtualTravelGuardCount);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting data: ", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleFilter = (status) => {
    setFilter(status === "online");
  };

  const calculateMapCenter = () => {
    const filteredUsers =
      filter === null ? users : users.filter((user) => user.isActive === filter);

    const defaultCenter = { lat: 9.082, lng: 8.6753 };
    if (filteredUsers.length === 0) {
      if (mapCenter.lat !== defaultCenter.lat || mapCenter.lng !== defaultCenter.lng) {
        setMapCenter(defaultCenter);
      }
      return;
    }

    let sumLat = 0;
    let sumLng = 0;
    filteredUsers.forEach((user) => {
      sumLat += user.Latitude;
      sumLng += user.Longitude;
    });
    const newCenter = { lat: sumLat / filteredUsers.length, lng: sumLng / filteredUsers.length };

    if (mapCenter.lat !== newCenter.lat || mapCenter.lng !== newCenter.lng) {
      // setMapCenter(newCenter);
      setMapCenter(defaultCenter);
    }
  };

  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const mapStyles = { height: isLargeScreen ? "550px" : "400px", width: "100%" };

  if (!isLoaded) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
      >
        <h1>Loading the map...</h1>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
          {loading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Loading the map...
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
                  <MDTypography variant="h6" color="white">
                    Live location
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <div style={{ marginLeft: 10, marginBottom: 10 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleFilter("online")}
                      style={{
                        backgroundColor: filter ? "green" : "gray",
                        color: filter ? "white" : "black",
                      }}
                    >
                      Online ({onlineCount})
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleFilter("offline")}
                      style={{
                        marginLeft: 6,
                        backgroundColor: !filter ? "red" : "gray",
                        color: !filter ? "white" : "black",
                      }}
                    >
                      Offline ({offlineCount})
                    </Button>
                    <Button
                      variant="contained"
                      style={{ marginLeft: 6, backgroundColor: "#034f2c", color: "white" }}
                    >
                      Short Trip Distance ({shortDistanceCount})
                    </Button>
                    <Button
                      variant="contained"
                      style={{ marginLeft: 6, backgroundColor: "#198754", color: "white" }}
                    >
                      Long Trip Distance ({longDistanceCount})
                    </Button>
                    <Button
                      variant="contained"
                      style={{ marginLeft: 6, backgroundColor: "#212529", color: "white" }}
                    >
                      Virtual Home Check ({virtualHomeCheckCount})
                    </Button>
                    <Button
                      variant="contained"
                      style={{ marginLeft: 6, backgroundColor: "#ffc107", color: "white" }}
                    >
                      Virtual Travel Guard ({virtualTravelGuardCount})
                    </Button>
                  </div>
                  <GoogleMap mapContainerStyle={mapStyles} center={mapCenter} zoom={7}>
                    {users.map((user, index) => (
                      <Marker
                        key={index}
                        position={{ lat: user.Latitude, lng: user.Longitude }}
                        onClick={() => handleClickOpen(user)}
                      />
                    ))}
                    {/* {startTripLocation.map((user, index) => (
                      <Marker
                        key={index}
                        position={{ lat: user.userlat, lng: user.userlog }}
                        onClick={handleClickOpen}
                      />
                    ))}
                    {endTripLocation.map((user, index) => (
                      <Marker
                        key={index}
                        position={{ lat: user.endlat, lng: user.endlog }}
                        onClick={handleClickOpen}
                      />
                    ))} */}

<Dialog open={open} onClose={handleClose}>
      {userInfo && (
        <Box
          sx={{
            width: 250,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Avatar
            alt="User Photo"
            src={userInfo.userImage}
            sx={{ width: 80, height: 80 }}
          />
          <Link to={`/app1map/${userInfo?.id}`}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#d32f2f",
                color: "#ffffff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#c62828" },
              }}
            >
              Short Distance Escort Request
            </Button>
          </Link>
          <Box
            sx={{
              width: "100%",
              padding: 1,
              backgroundColor: "#00bcd4",
              color: "#ffffff",
              textAlign: "center",
              borderRadius: 1,
            }}
          >
            {userInfo.userName}
          </Box>
          <Box
            sx={{
              width: "100%",
              padding: 1,
              backgroundColor: "#d32f2f",
              color: "#ffffff",
              textAlign: "center",
              borderRadius: 1,
            }}
          >
            {userInfo.userPhone}
          </Box>
          <Link to={`/app1map/${userInfo?.id}`}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#000000",
                color: "#ffffff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#333333" },
              }}
            >
              Escort
            </Button>
          </Link>
        </Box>
      )}
    </Dialog>
                  </GoogleMap>
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Online_Offline_Users;


// import React, { useEffect, useState } from "react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { useNavigate } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { getCurrentAdminState } from "Utils/Functions";
// import Button from "@mui/material/Button";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useSelector } from "react-redux";
// import { useMediaQuery } from "@mui/material";
// import { Box, TextField, Avatar, Dialog } from "@mui/material";

// function Online_Offline_Users() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg", // Replace with your valid API key
//   });

//   const [users, setUsers] = useState([]);
//   const allData = useSelector((state) => state.data.allData);
//   const [loading, setLoading] = useState(false);
//   const [onlineCount, setOnlineCount] = useState(0);
//   const [offlineCount, setOfflineCount] = useState(0);
//   const [shortDistanceCount, setShortDistanceCount] = useState(0);
//   const [longDistanceCount, setLongDistanceCount] = useState(0);
//   const [virtualHomeCheckCount, setVirtualHomeCheckCount] = useState(0);
//   const [virtualTravelGuardCount, setVirtualTravelGuardCount] = useState(0);
//   const [filter, setFilter] = useState(true);
//   const [mapCenter, setMapCenter] = useState({ lat: 9.082, lng: 8.6753 });
//   const navigate = useNavigate();
//   const [userInfo, setUserInfo] = useState(null);
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = (user) => {
//     setUserInfo(user);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   const getData = async () => {
//     setLoading(true);
//     try {
//       const database = getDatabase();
//       const usersRef = ref(database, "/users");
//       const currentAdminState = await getCurrentAdminState();

//       get(usersRef)
//         .then((snapshot) => {
//           const usersData = snapshot.val();
//           const usersArray = [];
//           let onlineCount = 0;
//           let offlineCount = 0;
//           let shortDistanceCount = 0;
//           let longDistanceCount = 0;
//           let virtualHomeCheckCount = 0;
//           let virtualTravelGuardCount = 0;

//           for (const userId in usersData) {
//             if (usersData.hasOwnProperty(userId)) {
//               const user = usersData[userId];

//               if (
//                 user.userState &&
//                 (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
//               ) {
//                 usersArray.push(user);
//                 if (user.isActive) onlineCount++;
//                 else offlineCount++;

//                 if (user.ShortDistance_Escort) shortDistanceCount++;
//                 if (user.UserTour) longDistanceCount++;
//                 if (user.VirtualHomeCheck) virtualHomeCheckCount++;
//                 if (user.wellBeingServicesData) virtualTravelGuardCount++;
//               }
//             }
//           }

//           setUsers(usersArray);
//           setOnlineCount(onlineCount);
//           setOfflineCount(offlineCount);
//           setShortDistanceCount(shortDistanceCount);
//           setLongDistanceCount(longDistanceCount);
//           setVirtualHomeCheckCount(virtualHomeCheckCount);
//           setVirtualTravelGuardCount(virtualTravelGuardCount);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error getting data: ", error);
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   const handleFilter = (status) => {
//     setFilter(status === "online");
//   };

//   const isLargeScreen = useMediaQuery("(min-width:1200px)");
//   const mapStyles = { height: isLargeScreen ? "550px" : "400px", width: "100%" };

//   if (!isLoaded) {
//     return (
//       <div
//         style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
//       >
//         <h1>Loading the map...</h1>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
//           {loading ? (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               Loading the map...
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
//                   <MDTypography variant="h6" color="white">
//                     Live Location
//                   </MDTypography>
//                 </MDBox>
//                 <MDBox pt={3}>
//                   <div style={{ marginLeft: 10, marginBottom: 10 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleFilter("online")}
//                       style={{
//                         backgroundColor: filter ? "green" : "gray",
//                         color: filter ? "white" : "black",
//                       }}
//                     >
//                       Online ({onlineCount})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleFilter("offline")}
//                       style={{
//                         marginLeft: 6,
//                         backgroundColor: !filter ? "red" : "gray",
//                         color: !filter ? "white" : "black",
//                       }}
//                     >
//                       Offline ({offlineCount})
//                     </Button>
//                   </div>
//                   <GoogleMap mapContainerStyle={mapStyles} center={mapCenter} zoom={7}>
//                     {users.map((user, index) => (
//                       <Marker
//                         key={index}
//                         position={{ lat: user.Latitude, lng: user.Longitude }}
//                         onClick={() => handleClickOpen(user)}
//                       />
//                     ))}

//                     <Dialog open={open} onClose={handleClose}>
//                       {userInfo && (
//                         <Box
//                           sx={{
//                             width: 250,
//                             padding: 3,
//                             borderRadius: 2,
//                             boxShadow: 3,
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             gap: 2,
//                             backgroundColor: "#ffffff",
//                           }}
//                         >
//                           <Avatar
//                             alt="User Photo"
//                             src={userInfo.userImage}
//                             sx={{ width: 80, height: 80 }}
//                           />
//                           <Button
//                             variant="contained"
//                             fullWidth
//                             sx={{
//                               backgroundColor: "#d32f2f",
//                               color: "#ffffff",
//                               fontWeight: "bold",
//                               "&:hover": { backgroundColor: "#c62828" },
//                             }}
//                           >
//                             Short Distance Escort Request
//                           </Button>
//                           <TextField
//                             label={userInfo.userName}
//                             fullWidth
//                             InputProps={{
//                               disableUnderline: true,
//                               sx: { backgroundColor: "#00bcd4", color: "#ffffff" },
//                             }}
//                           />
//                           <TextField
//                             label={userInfo.userPhone}
//                             fullWidth
//                             InputProps={{
//                               disableUnderline: true,
//                               sx: { backgroundColor: "#d32f2f", color: "#ffffff" },
//                             }}
//                           />
//                           <Button
//                             variant="contained"
//                             fullWidth
//                             sx={{
//                               backgroundColor: "#000000",
//                               color: "#ffffff",
//                               fontWeight: "bold",
//                               "&:hover": { backgroundColor: "#333333" },
//                             }}
//                           >
//                             Escort
//                           </Button>
//                         </Box>
//                       )}
//                     </Dialog>
//                   </GoogleMap>
//                 </MDBox>
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Online_Offline_Users;




// import React, { useEffect, useState } from "react";
// import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { useNavigate } from "react-router-dom";
// import { getDatabase, ref, get } from "firebase/database";
// import { getCurrentAdminState } from "Utils/Functions";
// import Button from "@mui/material/Button";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useSelector } from "react-redux";
// import { useMediaQuery } from "@mui/material";

// function Online_Offline_Users() {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg", // Replace with your API key
//   });

//   const [users, setUsers] = useState([]);
//   const allData = useSelector((state) => state.data.allData);
//   const [loading, setLoading] = useState(false);
//   const [onlineCount, setOnlineCount] = useState(0);
//   const [offlineCount, setOfflineCount] = useState(0);
//   const [shortDistanceCount, setShortDistanceCount] = useState(0);
//   const [longDistanceCount, setLongDistanceCount] = useState(0);
//   const [virtualHomeCheckCount, setVirtualHomeCheckCount] = useState(0);
//   const [virtualTravelGuardCount, setVirtualTravelGuardCount] = useState(0);
//   const [filter, setFilter] = useState(true);
//   const [stateName, setStateName] = useState("");
//   const [startTripLocation, setStartTripLocation] = useState([]);
//   const [endTripLocation, setEndTripLocation] = useState([]);
//   const [mapCenter, setMapCenter] = useState({ lat: 9.0820, lng: 8.6753 });
//   const [directionsResponse, setDirectionsResponse] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       navigate("/authentication/sign-in");
//     }
//     getData();
//   }, [allData]);

//   const getData = async () => {
//     setLoading(true);
//     try {
//       const database = getDatabase();
//       const usersRef = ref(database, "/users");
//       const currentAdminState = await getCurrentAdminState();
//       setStateName(currentAdminState);

//       get(usersRef)
//         .then((snapshot) => {
//           const usersData = snapshot.val();
//           const usersArray = [];
//           let onlineCount = 0;
//           let offlineCount = 0;
//           let shortDistanceCount = 0;
//           let longDistanceCount = 0;
//           let virtualHomeCheckCount = 0;
//           let virtualTravelGuardCount = 0;
//           const newStartLocations = [];
//           const newEndLocations = [];

//           for (const userId in usersData) {
//             if (usersData.hasOwnProperty(userId)) {
//               const user = usersData[userId];

//               if (user.userState && (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())) {
//                 usersArray.push(user);
//                 if (user.isActive) onlineCount++;
//                 else offlineCount++;

//                 if (user.ShortDistance_Escort != null) {
//                   const shortDistanceInfo = user.ShortDistance_Escort;
//                   for (const shortdisdata in shortDistanceInfo) {
//                     const short_distance = shortDistanceInfo[shortdisdata];
//                     if (short_distance.Trip_Status != null) {
//                       newStartLocations.push({ userlat: short_distance.Latitude, userlog: short_distance.Longitude });
//                       const stopinfo = short_distance.stop;
//                       for (const stopdata in stopinfo) {
//                         const stop_data = stopinfo[stopdata];
//                         newEndLocations.push({ endlat: stop_data.stopLatitude, endlog: stop_data.stopLongitude });
//                       }
//                       shortDistanceCount++;
//                     }
//                   }
//                 }

//                 if (user.UserTour != null) {
//                   longDistanceCount++;
//                 }

//                 if (user.VirtualHomeCheck != null) {
//                   virtualHomeCheckCount++;
//                 }

//                 if (user.wellBeingServicesData != null) {
//                   virtualTravelGuardCount++;
//                 }
//               }
//             }
//           }
//           setUsers(usersArray);
//           setOnlineCount(onlineCount);
//           setOfflineCount(offlineCount);
//           setShortDistanceCount(shortDistanceCount);
//           setLongDistanceCount(longDistanceCount);
//           setVirtualHomeCheckCount(virtualHomeCheckCount);
//           setVirtualTravelGuardCount(virtualTravelGuardCount);
//           setStartTripLocation(newStartLocations);
//           setEndTripLocation(newEndLocations);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error getting data: ", error);
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   // Calculate route from start to end location for each trip
//  // Calculate route from start to end location for each trip
// const calculateRoute = (start, end) => {
//   const directionsService = new window.google.maps.DirectionsService();
//   directionsService.route(
//     {
//       origin: { lat: start.userlat, lng: start.userlog },
//       destination: { lat: end.endlat, lng: end.endlog },
//       travelMode: window.google.maps.TravelMode.DRIVING,
//     },
//     (result, status) => {
//       if (status === window.google.maps.DirectionsStatus.OK) {
//         setDirectionsResponse((prev) => [...prev, result]);
//       } else {
//         console.error("Error calculating route:", status);
//       }
//     }
//   );
// };

//   useEffect(() => {
//     // Call calculateRoute for each start and end location
//     if (startTripLocation.length && endTripLocation.length) {
//       for (let i = 0; i < startTripLocation.length; i++) {
//         calculateRoute(startTripLocation[i], endTripLocation[i]);
//       }
//     }
//   }, [startTripLocation, endTripLocation]);

//   const isLargeScreen = useMediaQuery("(min-width:1200px)");
//   const mapStyles = { height: isLargeScreen ? "550px" : "400px", width: "100%" };

//   if (!isLoaded) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
//         <h1>Loading the map...</h1>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6} style={{ position: "relative", minHeight: "60vh" }}>
//           {loading ? (
//             <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
//               Loading the map...
//             </div>
//           ) : (
//             <Grid item xs={12}>
//               <Card>
//                 <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
//                   <MDTypography variant="h6" color="white">
//                     Live location
//                   </MDTypography>
//                 </MDBox>
//                 <MDBox pt={3}>
//                   <div style={{ marginLeft: 10, marginBottom: 10 }}>
//                     <Button variant="contained" onClick={() => setFilter(true)} style={{ backgroundColor: filter ? "green" : "gray", color: "white" }}>
//                       Online ({onlineCount})
//                     </Button>
//                     <Button variant="contained" onClick={() => setFilter(false)} style={{ marginLeft: 6, backgroundColor: !filter ? "red" : "gray", color: "white" }}>
//                       Offline ({offlineCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#034f2c", color: "white" }}>
//                       Short Trip Distance ({shortDistanceCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#198754", color: "white" }}>
//                       Long Trip Distance ({longDistanceCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#212529", color: "white" }}>
//                       Virtual Home Check ({virtualHomeCheckCount})
//                     </Button>
//                     <Button variant="contained" style={{ marginLeft: 6, backgroundColor: "#ffc107", color: "white" }}>
//                       Virtual Travel Guard ({virtualTravelGuardCount})
//                     </Button>
//                   </div>
//                   <GoogleMap mapContainerStyle={mapStyles} center={mapCenter} zoom={7}>
//                     {users.map((user, index) => (
//                       <Marker key={index} position={{ lat: user.Latitude, lng: user.Longitude }} />
//                     ))}
//                     {directionsResponse.map((response, index) => (
//                       <DirectionsRenderer key={index} directions={response} options={{ polylineOptions: { strokeColor: "#FF0000", strokeWeight: 4 } }} />
//                     ))}
//                   </GoogleMap>
//                 </MDBox>
//               </Card>
//             </Grid>
//           )}
//         </Grid>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Online_Offline_Users;