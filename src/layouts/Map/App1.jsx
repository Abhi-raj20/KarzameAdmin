// import {
//     Box,
//     Button,
//     ButtonGroup,
//     Flex,
//     HStack,
//     IconButton,
//     Input,
//     SkeletonText,
//     Text,
//   } from '@chakra-ui/react'
//   import { FaLocationArrow, FaTimes } from 'react-icons/fa'

//   import {
//     useJsApiLoader,
//     GoogleMap,
//     Marker,
//     Autocomplete,
//     DirectionsRenderer,
//   } from '@react-google-maps/api'
//   import { useRef, useState } from 'react'

//   const center = { lat: 48.8584, lng: 2.2945 }

//   function App1() {
//     const { isLoaded } = useJsApiLoader({
//       googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
//       libraries: ['places'],
//     })

//     const [map, setMap] = useState(/** @type google.maps.Map */ (null))
//     const [directionsResponse, setDirectionsResponse] = useState(null)
//     const [distance, setDistance] = useState('')
//     const [duration, setDuration] = useState('')

//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const originRef = useRef()
//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const destiantionRef = useRef()

//     if (!isLoaded) {
//       return <SkeletonText />
//     }

//     async function calculateRoute() {
//       if (originRef.current.value === '' || destiantionRef.current.value === '') {
//         return
//       }
//       // eslint-disable-next-line no-undef
//       const directionsService = new google.maps.DirectionsService()
//       const results = await directionsService.route({
//         origin: originRef.current.value,
//         destination: destiantionRef.current.value,
//         // eslint-disable-next-line no-undef
//         travelMode: google.maps.TravelMode.DRIVING,
//       })
//       setDirectionsResponse(results)
//       setDistance(results.routes[0].legs[0].distance.text)
//       setDuration(results.routes[0].legs[0].duration.text)
//     }

//     function clearRoute() {
//       setDirectionsResponse(null)
//       setDistance('')
//       setDuration('')
//       originRef.current.value = ''
//       destiantionRef.current.value = ''
//     }

//     return (
//       <Flex
//         position='relative'
//         flexDirection='column'
//         alignItems='center'
//         h='100vh'
//         w='100vw'
//       >
//         <Box position='absolute' left={0} top={0} h='100%' w='100%'>
//           {/* Google Map Box */}
//           <GoogleMap
//             center={center}
//             zoom={15}
//             mapContainerStyle={{ width: '100%', height: '100%' }}
//             options={{
//               zoomControl: false,
//               streetViewControl: false,
//               mapTypeControl: false,
//               fullscreenControl: false,
//             }}
//             onLoad={map => setMap(map)}
//           >
//             <Marker position={center} />
//             {directionsResponse && (
//               <DirectionsRenderer directions={directionsResponse} />
//             )}
//           </GoogleMap>
//         </Box>
//         <Box
//           p={4}
//           borderRadius='lg'
//           m={4}
//           bgColor='white'
//           shadow='base'
//           minW='container.md'
//           zIndex='1'
//         >
//           <HStack spacing={2} justifyContent='space-between'>
//             <Box flexGrow={1}>
//               <Autocomplete>
//                 <Input type='text' placeholder='Origin' ref={originRef} />
//               </Autocomplete>
//             </Box>
//             <Box flexGrow={1}>
//               <Autocomplete>
//                 <Input
//                   type='text'
//                   placeholder='Destination'
//                   ref={destiantionRef}
//                 />
//               </Autocomplete>
//             </Box>

//             <ButtonGroup>
//               <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
//                 Calculate Route
//               </Button>
//               <IconButton
//                 aria-label='center back'
//                 icon={<FaTimes />}
//                 onClick={clearRoute}
//               />
//             </ButtonGroup>
//           </HStack>
//           <HStack spacing={4} mt={4} justifyContent='space-between'>
//             <Text>Distance: {distance} </Text>
//             <Text>Duration: {duration} </Text>
//             <IconButton
//               aria-label='center back'
//               icon={<FaLocationArrow />}
//               isRound
//               onClick={() => {
//                 map.panTo(center)
//                 map.setZoom(15)
//               }}
//             />
//           </HStack>
//         </Box>
//       </Flex>
//     )
//   }

//   export default App1

//   React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <App />
//     </ChakraProvider>
//   </React.StrictMode>

// import React, { useRef, useState,useCallback } from 'react';
// import {
//   Box,
//   Button,
//   IconButton,
//   Input,
//   Paper,
//   Typography,
//   Grid,
// } from '@mui/material';
// import mapicon from "../../assets/images/mapIcon.jpg";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { FaLocationArrow, FaTimes } from 'react-icons/fa';
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsRenderer,
//   OverlayView
// } from '@react-google-maps/api';
// import { useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { useSpring, animated } from "react-spring";
// import animationData from "./../../assets/Lottie/Siren.json";

// function App1() {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
//     libraries: ['places'],
//   });

//   const [map, setMap] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   // const [distance, setDistance] = useState('');
//   const [duration, setDuration] = useState('');
//   const [center, setCenter] = useState({ lat: 22.9676, lng: 76.0534 });
//   // const [center, setCenter] = useState({ lat: 0, lng: 0 });
//   const [user, setUser] = useState(null);
//   const [nearUsers, setNearUsers] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [notiUsers, setNotiUsers] = useState([]);
//   const [modalData, setModalData] = useState();
//   const [locationLink, setLocationLink] = useState("");
//   const [userImg, setUserImg] = useState("");
//   const [userPhone, setUserPhone] = useState("");
//   const [status, setStatus] = useState("");
//   const { userId } = useParams();
//   const queryParams = new URLSearchParams(window.location.search);
//   const userData = queryParams.get("userData");

//   const [prevIsMoving, setPrevIsMoving] = useState(null);

//   const [Distanse, setDistance] = useState(1000);

//   const originRef = useRef();
//   const destinationRef = useRef();

// const iconUrl =
// "https://firebasestorage.googleapis.com/v0/b/karzame-f00a9.appspot.com/o/Van.jpg?alt=media&token=bc3ed248-6b66-489f-9d76-095f08181c9e ";
// const params = useParams();

// const ImageOverlay = ({ position, imageUrl, item, type = null }) => {
//   const imageStyle = {
//     width: "50px",
//     height: "50px",
//     position: "absolute",
//     transform: "translate(-50%, -50%)",
//     top: 0,
//     left: 0,
//   };

//   const AnimatedMarker = ({ position, title, imageUrl }) => {
//     const [animatedPosition, setAnimatedPosition] = useState(position);

//     const props = useSpring({
//       from: { lat: animatedPosition.lat, lng: animatedPosition.lng },
//       to: { lat: position.lat, lng: position.lng },
//       config: { duration: 1000 }, // Adjust the duration as needed
//       onFrame: ({ lat, lng }) => setAnimatedPosition({ lat, lng }),
//     });

//     return (
//       <animated.div
//         style={{
//           position: "absolute",
//           transform: `translate(${props.lng}px, ${props.lat}px)`,
//         }}
//       >
//         <Marker title={title}>
//           <ImageOverlay
//             position={{ lat: position.lat, lng: position.lng }}
//             imageUrl={imageUrl}
//             item={user}
//             type={"user"}
//           />
//         </Marker>
//       </animated.div>
//     );
//   };

//   return (
//     <OverlayView
//       position={position}
//       mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
//       getPixelPositionOffset={() => ({ x: -25, y: -25 })} // Adjust offset if needed   //onClick={() => openModal(item, type)}
//     >
//       <div style={imageStyle} >
//         {userData === "truck" ? (
//           <img
//             height={50}
//             width={50}
//             style={{ backgroundSize: "contain", marginLeft: 20 }}
//             className="rounded-circle"
//             src={imageUrl}
//             alt="Marker Image"
//           />
//         ) : (
//         <>hello</>
//           // <LottieAnimation width={80} height={80} />
//         )}
//       </div>
//     </OverlayView>
//   );
// }
//  const fetchData = useCallback(async () => {
//     const db = getDatabase();
//     const starCountRef = ref(db, `users/${params.id}`);
//     onValue(starCountRef, (snapshot) => {
//       console.log("fetch data by id", snapshot.val());
//       const isMoving = snapshot.val().IsMoving;
//       const shortDistance = snapshot.val().ShortDistance_Escort;
//       for(const info in shortDistance){
//         const distance = shortDistance[info];
//         if(distance.IsMoving === 'Moving'){
//           setCenter({lat : distance.LiveLatitude, log : distance.LiveLongitude});
//           setDistance()
//         }
//       }
//       // alert (isMoving)
//       // if ( isMoving == false  ) {
//       // // showAlert(isMoving);
//       // toast.warning( `${snapshot.val().userName} Is Stopped`)
//       // setPrevIsMoving(isMoving);
//       // }

//       if (isMoving && !prevIsMoving) {
//         // The user is currently moving, and was not moving previously

//         // toast.info(
//         //   <CustomToast
//         //     phone={snapshot.val().userPhone}
//         //     message={`${snapshot.val().userName} starts moving`}
//         //     icon={userImg}
//         //   />,
//         //   {
//         //     position: toast.POSITION.TOP_RIGHT,
//         //     autoClose: 10000,
//         //   }
//         // );
//         setUserPhone(snapshot.val().userPhone);
//         setStatus(`${snapshot.val().userName} starts moving`);
//       } else if (!isMoving) {
//         // The user is currently not moving, and was moving previously

//         // toast.info(
//         //   <CustomToast
//         //     phone={snapshot.val().userPhone}
//         //     message={`${snapshot.val().userName} stopped moving`}
//         //     icon={mapicon}
//         //   />,
//         //   {
//         //     position: toast.POSITION.TOP_RIGHT,
//         //     autoClose: 10000,
//         //   }
//         // );
//         setUserPhone(snapshot.val().userPhone);
//         setStatus(`${snapshot.val().userName} stopped moving`);
//       }

//       setPrevIsMoving(isMoving);

//       setCenter({
//         lat: snapshot.val().LiveLatitude,
//         lng: snapshot.val().LiveLongitude,
//       });
//       setUser(snapshot.val());
//       // Set the location link using the user's latitude and longitude
//       const link = `https://www.google.com/maps/place/${snapshot.val().LiveLatitude},${
//         snapshot.val().LiveLongitude
//       }`;
//       setLocationLink(link);
//       setUserImg(snapshot.val().userImage);

//       // getOperators(snapshot.val()?.LiveLatitude, snapshot.val()?.LiveLongitude, 500);
//     });
//   }, [nearUsers, Distanse, prevIsMoving]);

//   if (!isLoaded) {
//     return <Typography>Loading...</Typography>;
//   }

//   async function calculateRoute() {
//     if (originRef.current.value === '' || destinationRef.current.value === '') {
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     const results = await directionsService.route({
//       origin: originRef.current.value,
//       destination: destinationRef.current.value,
//       travelMode: window.google.maps.TravelMode.DRIVING,
//     });
//     setDirectionsResponse(results);
//     setDistance(results.routes[0].legs[0].distance.text);
//     setDuration(results.routes[0].legs[0].duration.text);
//   }

//   function clearRoute() {
//     setDirectionsResponse(null);
//     setDistance('');
//     setDuration('');
//     originRef.current.value = '';
//     destinationRef.current.value = '';
//   }

//   return (
//     <Box position="relative" height="100vh" width="100vw">
//       {/* Google Map Container */}
//       <GoogleMap
//         center={center}
//         zoom={15}
//         mapContainerStyle={{ width: '100%', height: '100%' }}
//         options={{
//           zoomControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//         }}
//         onLoad={(map) => setMap(map)}
//       >
//         <Marker position={center} />
//         {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
//       </GoogleMap>

//       {/* Controls Panel */}
//       <Paper
//         elevation={3}
//         sx={{
//           position: 'absolute',
//           top: 16,
//           left: '50%',
//           transform: 'translateX(-50%)',
//           padding: 2,
//           width: 400,
//           zIndex: 10,
//         }}
//       >
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={5}>
//             <Autocomplete>
//               <Input fullWidth placeholder="Origin" inputRef={originRef} />
//             </Autocomplete>
//           </Grid>
//           <Grid item xs={5}>
//             <Autocomplete>
//               <Input fullWidth placeholder="Destination" inputRef={destinationRef} />
//             </Autocomplete>
//           </Grid>
//           <Grid item xs={2}>
//             <IconButton onClick={clearRoute}>
//               <FaTimes />
//             </IconButton>
//           </Grid>
//           <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
//             <Button variant="contained" color="primary" onClick={calculateRoute}>
//               Calculate Route
//             </Button>
//             <IconButton
//               color="primary"
//               onClick={() => {
//                 map.panTo(center);
//                 map.setZoom(15);
//               }}
//             >
//               <FaLocationArrow />
//             </IconButton>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="body2">Distance: {Distanse}</Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="body2">Duration: {duration}</Typography>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   );
// }

// // export default App1;
import React, { useCallback, useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import { Box, Button, Paper, Typography, Grid } from "@mui/material";
import { toast } from "react-toastify";
import mapicon from "../../assets/images/mapIcon.jpg";
import stopicon from "../../assets/images/stop.png";
import "react-toastify/dist/ReactToastify.css";
import "./map.css";

const libraries = ["places"]; // Move outside to prevent unnecessary reloading

const App1 = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [center, setCenter] = useState({ lat: 22.7196, lng: 75.8577 });
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [tripStop, setTripStop] = useState([]);
  // const userId = "-NwrMtajniR3U1M0zYqk";
  const { userId } = useParams();
  const params = useParams();


  const fetchUserData = useCallback(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${params.id}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      console.log("userData....",userData);
      
      if (userData) {
        const liveLocation = {
          lat: userData.LiveLatitude,
          lng: userData.LiveLongitude,
        };
        setCenter(liveLocation);

        const escortData = userData.ShortDistance_Escort;
        console.log("escortData.....",escortData);
        

if (escortData) {
  const keys = Object.keys(escortData); // Get all keys
  const lastKey = keys[keys.length - 1]; // Find the last key

  if (lastKey) {
    const lastValue = escortData[lastKey]; // Access the last value
    console.log("lastvalues......",lastValue);
    
    // Set origin and destination based on the last value
    setOrigin({ lat: lastValue.Latitude, lng: lastValue.Longitude });
    setDestination(center); // Assuming 'center' is predefined

    // If there are stops, process the stops
    const stopInfo = lastValue.stops;
    console.log("stopInfo.....",stopInfo);
    // let tripEscort = [];
    // if (stopInfo) {
    //   for(const stopdata in stopInfo){
    //     const stop = stopInfo[stopdata];
    //     console.log("last stop data", stop);
    //     setTripStop(stop);
        
    //   }
    //   // const stopKeys = Object.keys(stopInfo);
    //   // const lastStopKey = stopKeys[stopKeys.length - 1]; // Last stop key
    //   // if (lastStopKey) {
    //   //   const lastStop = stopInfo[lastStopKey];
    //   //   console.log("last Stop.....",lastStop);

        
    //   //   // setDestination({ lat: lastStop.stopLatitude, lng: lastStop.stopLongitude });
    //   // }
    // }

    if (stopInfo) {
      const stops = [];
      for (const stopdata in stopInfo) {
        const stop = stopInfo[stopdata];
        console.log("Stop data:", stop);
        stops.push(stop); // Add stops to the array
      }
      setTripStop(stops); // Update state with the array
    }

    console.log('Last Escort Data:', lastValue);
  }
}

        // const escortData = userData.ShortDistance_Escort;
        // if (escortData) {
        //   for (const key in escortData) {
        //     const shortInfo = escortData[key];
        //     setOrigin({ lat: shortInfo.Latitude, lng: shortInfo.Longitude });
        //     setDestination(center);
        //     // const stopInfo = shortInfo.stop;
        //     // if (stopInfo) {
        //     //   for (const stopKey in stopInfo) {
        //     //     const stop = stopInfo[stopKey];
        //     //     setDestination({ lat: stop.stopLatitude, lng: stop.stopLongitude });
        //     //   }
        //     //}

        //   }
        // }
      }
    });
  }, []);

  const calculateRoute = async () => {
    if (!origin || !destination) {
      toast.error("Please provide both origin and destination.");
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      // const results = await directionsService.route({
      //   origin,
      //   destination,
      //   travelMode: window.google.maps.TravelMode.DRIVING,
      // });
      const results = await directionsService.route({
        origin: new window.google.maps.LatLng(origin.lat, origin.lng), // Convert to LatLng
        destination: new window.google.maps.LatLng(destination.lat, destination.lng), // Convert to LatLng
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      console.log("result..",results);
      
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      toast.error("Failed to calculate route.");
      console.error("Directions API Error:", error);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (origin && destination) {
      calculateRoute();
    }
  }, [origin, destination]); // Trigger calculateRoute when origin or destination changes

  
  console.log("Origin:", origin);
console.log("Destination:", destination);


  // if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded)
    return (
      <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
        <h1>Loading the map...</h1>
      </div>
    );

  return (
    <Box position="relative" height="100vh" width="100vw">
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
      >
        <Marker
          position={center}
          icon={{
            url: mapicon,
            scaledSize: new window.google.maps.Size(50, 50), // Set desired width and height
            origin: new window.google.maps.Point(0, 0), // Specify the origin point
            anchor: new window.google.maps.Point(25, 25), // Set anchor point at the center
          }}
        />
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}

        {tripStop.map((stop, index) => {
  const user = { lat: stop.stopLatitude, lng: stop.stopLongitude };
  return (
    <Marker
      key={index}
      position={user}
      icon={{
        url: stopicon,
        scaledSize: new window.google.maps.Size(50, 50), // Set desired width and height
        anchor: new window.google.maps.Point(25, 25), // Set anchor point at the center
      }}
    />
  );
})}

        
      </GoogleMap>

      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          padding: 2,
          width: 400,
          zIndex: 10,
        }}
      >
        <Typography variant="body1">
          {distance && `Distance: ${distance}`}
          {duration && `Duration: ${duration}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button 
            variant="contained"   
            sx={{
      color: "black", // Set text color to black
      fontWeight: "bold", // Make text bold
    }}
     color="primary" fullWidth onClick={calculateRoute}>
              Calculate Route
            </Button>
          </Grid>
          {/* <Grid item xs={12}>
            <Button variant="outlined" color="secondary" fullWidth onClick={clearRoute}>
              Clear Route
            </Button>
          </Grid> */} 
        </Grid>
      </Paper>
    </Box>
  );
};

export default App1;


// import React, { useCallback, useEffect, useState } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   GoogleMap,
//   Marker,
//   DirectionsRenderer,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { connectSocket, disconnectSocket, sendMessage } from '../../socket/SocketService';
// import { useParams } from "react-router-dom";
// import { Box, Button, Paper, Typography, Grid } from "@mui/material";
// import { toast } from "react-toastify";
// import mapicon from "../../assets/images/mapIcon.jpg";
// import { useSelector } from "react-redux";
// import stopicon from "../../assets/images/stop.png";
// import "react-toastify/dist/ReactToastify.css";

// const libraries = ["places"]; // Move outside to prevent unnecessary reloading

// const App1 = () => {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg", // Replace with your API key
//   });
//   const [users, setUsers] = useState([]);
//   const [status, setStatus] = useState('Connecting...');
//   const [loading, setLoading] = useState(true);
//   const [map, setMap] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const [center, setCenter] = useState({ lat: 22.7196, lng: 75.8577 });
//   const [origin, setOrigin] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [tripStop, setTripStop] = useState([]);
//   const { id: userId } = useParams();
 
 
 
//   useEffect(() => {
//     const onConnect = () => {
//       setStatus('Connected');
//       console.log("Connection established");
//     };

//     const onDisconnect = () => {
//       setStatus('Disconnected');
//       console.log("Disconnected from server");
//     };

//     const onUserLiveLocation = (userLiveLocation) => {
//       console.log("usersData......", userLiveLocation);

//       const formattedUsersData = userLiveLocation.map((user, index) => ({
//         id: user.userId,
//         lat : user.lat,
//         lng : user.lng,
//         // name: user.userName || 'Unknown User',
//         // imageUrl: user.userImage || '/images/default.jpg',
//         // onlineStatus: user.onlineStatus ? 'Online' : 'Offline',
//         // isMoving: user.isMoving ? 'Moving' : 'Stopped',
//         // wellbeingcheck: user.wellbeingcheck === 'true' ? "On" : "Off",
//         // lastLocation: user.lastLocation ? user.userId : 'Location not available',
//         // tripStatus: user.tripStatus || 'No Status',
//         // batteryLevel: user.batteryLevel ? user.batteryLevel : 'Unknown',
//         // phoneStatus: user.phoneStatus || 'Device Unknown',
//         // geofenceStatus: user.geofenceStatus || 'Unknown',
//       }));

//       setUsers(formattedUsersData);
//       setLoading(false);
//     };

//     connectSocket(onConnect, onDisconnect, onUserLiveLocation);

//     return () => {
//       disconnectSocket();
//     };
//   }, []);

//   const navigate = useNavigate();
//   const allData = useSelector((state) => state.data.allData);

//   const getData = () => {
//     sendMessage('Hello from userLiveLocation tracking!');
//     console.log("this is a formated data.....123", users);
    
//   };

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     // if (!user) {
//     //   navigate("/authentication/sign-in");
//     // }E properties of undefined (reading 'apply')
//     console.log("this is a live location stracking",user);
    
//     getData();
//   }, []);

//   const userLiveLocation = () => {
//     console.log("this is a live location tracking", users);
  
//     for (const user of users) { // Use 'for...of' to directly access each object
//       console.log("this is a live location tracking", user);
  
//       if (user.id === userId) { // Corrected comparison to use 'user.id'
//         const location = {
//           lat: user.lat,
//           lng: user.lng,
//         };
//         setCenter(location);
//         break; // Exit loop once the matching user is found
//       }
//     }
//   };
  

//   const fetchUserData = useCallback(() => {
//     const db = getDatabase();
//     const userRef = ref(db, `users/${userId}`);

//     onValue(userRef, (snapshot) => {
//       const userData = snapshot.val();
//       if (userData) {
//         // const liveLocation = {
//         //   lat: userData.LiveLatitude,
//         //   lng: userData.LiveLongitude,
//         // };
//         // setCenter(liveLocation);

//         const escortData = userData.ShortDistance_Escort;
//         if (escortData) {
//           const keys = Object.keys(escortData);
//           const lastKey = keys[keys.length - 1];
          
//           const liveLocation = {
//             lat: lastKey.LiveLatitude,
//             lng: lastKey.LiveLongitude,
//           };
//           setCenter(liveLocation);
         
         
//           if (lastKey) {
//             const lastValue = escortData[lastKey];
//             setOrigin({ lat: lastValue.Latitude, lng: lastValue.Longitude });
//             setDestination(liveLocation);

//             const stops = [];
//             const stopInfo = lastValue.stops;
            
//             if (stopInfo) {
//               // const keys1 = Object.keys(stopInfo);
//               // const lastKey1 = keys1[keys1.length - 1];
//               // if (lastKey) {
//               //   const lastValue1 = stopInfo[lastKey1];
//               //   setDestination({lat : lastValue1.stopLatitude, lng : lastValue1.stopLongitude});
//               // }
    
//               for (const stopdata in stopInfo) {
//                 const stop = stopInfo[stopdata];
//                 stops.push(stop);
//               }
//             }
//             setTripStop(stops);
//           }
//         }
//       }
//     });
//   }, [userId]);

//   const calculateRoute = async () => {
//     if (!origin || !destination) {
//       toast.error("Origin or destination is missing. Please try again.");
//       return;
//     }

//     try {
//       const directionsService = new window.google.maps.DirectionsService();
//       const results = await directionsService.route({
//         origin: new window.google.maps.LatLng(origin.lat, origin.lng),
//         destination: new window.google.maps.LatLng(destination.lat, destination.lng),
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       });

//       setDirectionsResponse(results);
//       setDistance(results.routes[0].legs[0].distance.text);
//       setDuration(results.routes[0].legs[0].duration.text);
//     } catch (error) {
//       toast.error("Failed to calculate route.");
//       console.error("Directions API Error:", error);
//     }
//   };

//   const clearRoute = () => {
//     setDirectionsResponse(null);
//     setDistance("");
//     setDuration("");
//   };

//  // useEffect to call the function every 2 seconds
//  useEffect(() => {
//   const intervalId = setInterval(() => {
//     fetchUserData();
//   }, 2000); // Call every 2 seconds

//   return () => clearInterval(intervalId); // Cleanup interval on component unmount
// }, [fetchUserData]);

//   useEffect(() => {
//     if (origin && destination) {
//       calculateRoute();
//     }
//   }, [origin, destination]);

//   if (!isLoaded) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
//         <h1>Loading the map...</h1>
//       </div>
//     );
//   }
//   console.log("user data is .......12....",users);

//   return (
//     <Box position="relative" height="100vh" width="100vw">
//       <GoogleMap
//         center={center}
//         zoom={15}
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//         options={{
//           zoomControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//         }}
//         onLoad={(map) => setMap(map)}
//       >     

// {/* {users.map((user) => (
//   <Marker
//   key={user.id}
//   position={{ lat: user.latitude, lng: user.longitude
//     }}
//     icon={{
//       url: mapicon,
//       scaledSize: new window.google.maps.Size(50, 50),
//       origin: new window.google.maps.Point(0, 0),
//       anchor: new window.google.maps.Point(25, 25),
//       }}
//       />

// ))} */}
//         <Marker
//           position={center}
//           icon={{
//             url: mapicon,
//             scaledSize: new window.google.maps.Size(50, 50),
//             origin: new window.google.maps.Point(0, 0),
//             anchor: new window.google.maps.Point(25, 25),
//           }}
//         />
//         {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
//         {tripStop.map((stop, index) => (
//           <Marker
//             key={index}
//             position={{ lat: stop.stopLatitude, lng: stop.stopLongitude }}
//             icon={{
//               url: stopicon,
//               scaledSize: new window.google.maps.Size(50, 50),
//               anchor: new window.google.maps.Point(25, 25),
//             }}
//           />
//         ))}
//       </GoogleMap>

//       <Paper
//         elevation={3}
//         sx={{
//           position: "absolute",
//           top: 16,
//           left: "50%",
//           transform: "translateX(-50%)",
//           padding: 2,
//           width: 400,
//           zIndex: 10,
//         }}
//       >
//         <Typography variant="body1">
//           {distance && `Distance: ${distance}`}
//           {duration && `Duration: ${duration}`}
//         </Typography>
//         <Grid container spacing={2}>
//           {/* <Grid item xs={12}>
//             <Button
//               variant="contained"
//               style={{"color" : "black"}}
//               sx={{ color: "black", fontWeight: "bold" }}
//               color="primary"
//               fullWidth
//               onClick={calculateRoute}
//             >
//               Calculate Route
//             </Button>
//           </Grid> */}
//           {/* <Grid item xs={12}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               fullWidth
//               onClick={clearRoute}
//             >
//               Clear Route
//             </Button>
//           </Grid> */}
//         </Grid>
//       </Paper>
//     </Box>
//   );
// };

// export default App1;



// import React, { useEffect, useState } from 'react';
// import { Box, Button, Paper, Typography, Grid } from '@mui/material';
// import { FaTimes } from 'react-icons/fa';
// import {
//   useJsApiLoader,
//   GoogleMap,
//   DirectionsRenderer,
// } from '@react-google-maps/api';
// import { useSearchParams } from 'react-router-dom';

// const defaultCenter = { lat: 48.8584, lng: 2.2945 }; // Eiffel Tower coordinates

// function App1() {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "YOUR_API_KEY", // Replace with your actual API key
//     libraries: ['places'],
//   });

//   const [map, setMap] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [distance, setDistance] = useState('');
//   const [duration, setDuration] = useState('');
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const originLat = parseFloat(searchParams.get('originLat'));
//     const originLng = parseFloat(searchParams.get('originLng'));
//     const destLat = parseFloat(searchParams.get('destLat'));
//     const destLng = parseFloat(searchParams.get('destLng'));

//     // Validate lat/lng values
//     if (
//       !isNaN(originLat) &&
//       !isNaN(originLng) &&
//       !isNaN(destLat) &&
//       !isNaN(destLng)
//     ) {
//       const origin = { lat: originLat, lng: originLng };
//       const destination = { lat: destLat, lng: destLng };
//       calculateRoute(origin, destination);
//     } else {
//       console.error('Invalid or missing coordinates in URL parameters');
//     }
//   }, [searchParams]);

//   async function calculateRoute(origin, destination) {
//     try {
//       const directionsService = new window.google.maps.DirectionsService();
//       const results = await directionsService.route({
//         origin, // { lat, lng } format
//         destination, // { lat, lng } format
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       });
//       setDirectionsResponse(results);
//       setDistance(results.routes[0].legs[0].distance.text);
//       setDuration(results.routes[0].legs[0].duration.text);
//     } catch (error) {
//       console.error('Error calculating route:', error);
//     }
//   }

//   function clearRoute() {
//     setDirectionsResponse(null);
//     setDistance('');
//     setDuration('');
//   }

//   if (!isLoaded) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Box position="relative" height="100vh" width="100vw">
//       <GoogleMap
//         center={defaultCenter}
//         zoom={15}
//         mapContainerStyle={{ width: '100%', height: '100%' }}
//         options={{
//           zoomControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//         }}
//         onLoad={(map) => setMap(map)}
//       >
//         {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
//       </GoogleMap>

//       {/* Controls Panel */}
//       <Paper
//         elevation={3}
//         sx={{
//           position: 'absolute',
//           top: 16,
//           left: '50%',
//           transform: 'translateX(-50%)',
//           padding: 2,
//           width: 400,
//           zIndex: 10,
//         }}
//       >
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12}>
//             <Button variant="contained" color="primary" onClick={clearRoute} startIcon={<FaTimes />}>
//               Clear Route
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="body2">Distance: {distance}</Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="body2">Duration: {duration}</Typography>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   );
// }

// export default App1;
