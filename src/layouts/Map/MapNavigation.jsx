// import React, { useState, useEffect } from "react";
// import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

// const MapNavigation = () => {
//   const [userLocation, setUserLocation] = useState({ lat: 10.0820, lng: 9.6753 });
//   const [destination, setDestination] = useState({ lat: 9.0820, lng: 8.6753 }); // Example destination (Abuja, Nigeria)
//   const [directionsResponse, setDirectionsResponse] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
//   });

//   useEffect(() => { 
//     // Get user's current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => console.error("Error getting user location:", error)
//       );
//     }
//   }, []);

//   const calculateRoute = async () => {
//     if (!userLocation || !destination) return;

//     const directionsService = new google.maps.DirectionsService();
//     try {
//       const result = await directionsService.route({
//         origin: userLocation,
//         destination,
//         travelMode: google.maps.TravelMode.DRIVING,
//       });
//       setDirectionsResponse(result);
//     } catch (error) {
//       console.error("Error calculating route:", error);
//     }
//   };

//   useEffect(() => {
//     if (userLocation) calculateRoute();
//   }, [userLocation]);

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <GoogleMap
//       center={userLocation || { lat: 0, lng: 0 }} 
//       zoom={14}
//       mapContainerStyle={{ width: "100%", height: "100vh" }}
//     >
//       {userLocation && <Marker position={userLocation} />}
//       {destination && <Marker position={destination} />}
//       {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
//     </GoogleMap>
//   );
// };

// export default MapNavigation;



import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { ArrowForward, Call } from "@mui/icons-material";

const MapNavigation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState({ lat: 39.0997, lng: -94.5786 }); // Example coordinates
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting user location:", error)
      );
    }
  }, []);

  const calculateRoute = async () => {
    if (!userLocation || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    try {
      const result = await directionsService.route({
        origin: userLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(result);
      setDistance(result.routes[0].legs[0].distance.text);
      setDuration(result.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  useEffect(() => {
    if (userLocation) calculateRoute();
  }, [userLocation]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <GoogleMap
        center={userLocation || { lat: 0, lng: 0 }}
        zoom={14}
        mapContainerStyle={{ width: "100%", height: "80%" }}
      >
        {userLocation && <Marker position={userLocation} />}
        {destination && <Marker position={destination} />}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      {/* Navigation Information Panel */}
      <Paper
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: "#0044cc",
          color: "#ffffff",
        }}
        elevation={3}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {distance} • {duration}
          </Typography>
          <IconButton color="inherit">
            <Call />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <ArrowForward />
          <Typography variant="subtitle1">Next Turn: Grand Blvd</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MapNavigation;



// import React, { useState, useEffect } from "react";
// import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

// const MapWithNavigation = () => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [destination] = useState({ lat: 39.0997, lng: -94.5786 }); // Destination coordinates
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [nextTurn, setNextTurn] = useState("");
  
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.watchPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           updateNextStep(location);
//         },
//         (error) => console.error(error),
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   const calculateRoute = async () => {
//     if (!userLocation || !destination) return;
//     const directionsService = new window.google.maps.DirectionsService();
//     const results = await directionsService.route({
//       origin: userLocation,
//       destination,
//       travelMode: window.google.maps.TravelMode.DRIVING,
//     });
//     setDirectionsResponse(results);
//     setNextTurn(results.routes[0].legs[0].steps[0].instructions); // Set the first turn
//   };

//   const updateNextStep = (currentLocation) => {
//     if (!directionsResponse) return;
//     const steps = directionsResponse.routes[0].legs[0].steps;
//     const nextStep = steps[currentStepIndex];
    
//     // Calculate the distance to the next step
//     const distanceToNextStep = google.maps.geometry.spherical.computeDistanceBetween(
//       new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
//       nextStep.end_location
//     );

//     // If close to the next step, move to the next instruction
//     if (distanceToNextStep < 30) { // 30 meters threshold
//       if (currentStepIndex < steps.length - 1) {
//         setCurrentStepIndex(currentStepIndex + 1);
//         setNextTurn(steps[currentStepIndex + 1].instructions);
//       } else {
//         setNextTurn("You have arrived at your destination!");
//       }
//     }
//   };

//   useEffect(() => {
//     if (userLocation) {
//       calculateRoute();
//     }
//   }, [userLocation]);

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <GoogleMap
//         center={userLocation || { lat: 0, lng: 0 }}
//         zoom={14}
//         mapContainerStyle={{ width: "100%", height: "80%" }}
//       >
//         {userLocation && <Marker position={userLocation} />}
//         {destination && <Marker position={destination} />}
//         {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
//       </GoogleMap>
//       <div style={{ padding: "1em", backgroundColor: "#fff" }}>
//         <h3>Next Instruction:</h3>
//         <p dangerouslySetInnerHTML={{ __html: nextTurn }} />
//       </div>
//     </div>
//   );
// };

// export default MapWithNavigation;


