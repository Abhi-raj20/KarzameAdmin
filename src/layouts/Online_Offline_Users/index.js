import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, useJsApiLoader, Marker } from "@react-google-maps/api";
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
import { useMediaQuery } from '@mui/material';

function Online_Offline_Users() {
  const { isLoaded } = useJsApiLoader({ 
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",      //AIzaSyC0Bt5wwj03GVbGoBMwxVnhMvHllozt9fc
  });
  const [users, setUsers] = useState([]);
  const allData = useSelector((state) => state.data.allData);
  const [loading, setLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0); // State to store the count of online users
  const [offlineCount, setOfflineCount] = useState(0); // State to store the count of offline users
  const [filter, setFilter] = useState(true); // State to store filter status, initialized to true for online users
  const [stateName, setStateName] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 }); // State to store map center
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/authentication/sign-in");
    }
    getData();
  }, [allData]); 

  useEffect(() => {
    fetchCoordinates();
  }, [users, stateName, mapCenter]);

  const fetchCoordinates = async () => {
    try {

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          stateName
        )}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`    //AIzaSyC2oEK5eAlXZ75c4-c_sKl_IZD7ZTsdI-E
      );
      
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setMapCenter({ lat: lat, lng: lng });
      } else {
        console.log("Coordinates not found for the state:", stateName);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);  
    }
  };
  
  useEffect(() => {
    if (users.length > 0) {
      // Calculate center and zoom level based on filtered users' coordinates
      calculateMapCenter();
    }
  }, [filter, users, mapCenter]);

  const getData = async () => {
    setLoading(true);

    try {
      const database = getDatabase();
      const usersRef = ref(database, "/users");

      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's city
      setStateName(currentAdminState);
      get(usersRef)
        .then((snapshot) => {
          const usersData = snapshot.val();
          const usersArray = [];
          let onlineCount = 0;
          let offlineCount = 0;

          for (const userId in usersData) {
            if (usersData.hasOwnProperty(userId)) {
              const user = usersData[userId];

              // Check if the user's state matches the current admin's state
              if (
                user.userState &&
                (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase())
              ) {
                usersArray.push(user);
                if (user.isActive) {
                  onlineCount++;
                } else {
                  offlineCount++;
                }
              }
            }
          }
                               
          setUsers(usersArray);
          setOnlineCount(onlineCount);
          setOfflineCount(offlineCount);
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

  // Function to filter users based on isActive status
  const handleFilter = (status) => {
    if (status === "online") {
      setFilter(true);
    } else if (status === "offline") {
      setFilter(false);
    }
  };

  // Calculate center based on filtered users' coordinates
  const calculateMapCenter = () => {
    const filteredUsers =
      filter === null ? users : users.filter((user) => user.isActive === filter);

    if (filteredUsers.length === 0) {
      setMapCenter({ lat: 0, lng: 0 });
      return;
    }

    let sumLat = 0;
    let sumLng = 0;

    filteredUsers.forEach((user) => {
      sumLat += user.Latitude;
      sumLng += user.Longitude;
    });

    const centerLat = sumLat / filteredUsers.length;
    const centerLng = sumLng / filteredUsers.length;

    setMapCenter({ lat: centerLat, lng: centerLng });
  };

  const isLargeScreen = useMediaQuery('(min-width:1200px)');
  const mapStyles = {
     height: isLargeScreen ? '550px' : '400px',  // Larger height for large screens
    width: "100%",
  };

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
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Ensure horizontal centering
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
                        backgroundColor: filter === true ? "green" : "gray",
                        color: filter === true ? "white" : "black",
                      }}
                    >
                      Online ({onlineCount})
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleFilter("offline")}
                      style={{
                        marginLeft: 6,
                        backgroundColor: filter === false ? "red" : "gray",
                        color: filter === false ? "white" : "black",
                      }}
                    >
                      Offline ({offlineCount})
                    </Button>
                  </div>

                  <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={mapCenter}>
                    {users.map((user) => (
                      <Marker
                        key={user.id}
                        position={{ lat: user.Latitude, lng: user.Longitude }}
                      />
                    ))}
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
