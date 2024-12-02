import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';

const FullScreenMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const startCoords = { lat: 9.0820, lng: 8.6753 }; // Replace with your start coordinates
  const endCoords = { lat: 9.1520, lng: 8.7353 }; // Replace with your end coordinates

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
      version: "weekly",
      libraries: ["geometry", "places"]
    });

    loader.load().then(() => {
      const google = window.google;
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: startCoords,
        zoom: 14,
        disableDefaultUI: true,
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#0000FF",
          strokeOpacity: 0.7,
          strokeWeight: 5,
        },
      });
      setMap(mapInstance);
      setDirectionsRenderer(directionsRendererInstance);

      // Calculate and display the route
      directionsService.route(
        {
          origin: startCoords,
          destination: endCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRendererInstance.setDirections(response);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    });
  }, []);

  useEffect(() => {
    if (map) {
      // Track live location
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentPosition = { lat: latitude, lng: longitude };

          // Move marker along the route
          new window.google.maps.Marker({
            position: currentPosition,
            map,
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: "#0000FF",
              fillOpacity: 1,
              strokeWeight: 2,
            },
          });
 
          map.panTo(currentPosition);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map]);

  return (
    <Box
      ref={mapRef}
      sx={{
        height: '100vh',
        width: '100vw',
      }}
    />
  );
};

export default FullScreenMap;
