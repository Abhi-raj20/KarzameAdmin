// import { Card } from "@mui/material";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
// import MDBox from "components/MDBox";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { GoogleMap,DirectionsRenderer, InfoBox, Marker, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { Box, Button, Paper, Typography, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarMenu, { SidebarMenuNav } from "react-bootstrap-sidebar-menu";

import { useSpring, animated } from "react-spring";

import mapicon from "../../assets/images/mapIcon.jpg";

import "./map.css";
import { sendNotification } from "./notification";
import renderNoti from "layouts/NotificationAlert";
import { renderPoliceAlert } from "layouts/NotificationAlert";
import lottie from "lottie-web";
import animationData from "./../../assets/Lottie/Siren.json";
import soundFile from "./../../Raw/Siren.wav";

function FinalMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
  });
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
//   const [center, setCenter] = useState({ lat: 22.7196, lng: 75.8577 });
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [user, setUser] = useState(null);
  const [nearUsers, setNearUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notiUsers, setNotiUsers] = useState([]);
  const [modalData, setModalData] = useState();
  const [locationLink, setLocationLink] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [status, setStatus] = useState("");
  const { userId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const userData = queryParams.get("userData");

  const [prevIsMoving, setPrevIsMoving] = useState(null);

  const [Distanse, setDistance] = useState(1000);

  const LottieAnimation = ({ width, height }) => {
    const audio = useRef(new Audio(soundFile));
    const containerRef = useRef(null);

    // useEffect(() => {
    //   const animation = lottie.loadAnimation({
    //     container: containerRef.current,
    //     renderer: "svg", // Use 'svg' for better performance
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //   });

    //   return () => {
    //     // Clean up the audio when the component unmounts
    //     audio.current.pause();
    //     audio.current.currentTime = 0;
    //   };
    // }, []);

    // useEffect(() => {
    //   audio.current.loop = true;
    //   audio.current.play();
    // }, []);

    return (
      <div
        ref={containerRef}
        style={{
          // backgroundSize: "contain",
          marginLeft: 10,
          marginTop: -10,
          width: width ? `${width}px` : "100%", // Set width to '100%' if not provided
          height: height ? `${height}px` : "100%", // Set height to '100%' if not provided
        }}
      ></div>
    );
  };

  const openModal = useCallback(
    (data, type) => {
      // alert(type)
      console.log("userD", data);
      let modalSetData = data;
      if (type == "user") {
        modalSetData.workerImage = modalSetData?.userImage;
        modalSetData.workerName = modalSetData.userName;
        modalSetData.workerPhoneNumber = modalSetData.userPhone;
        modalSetData.workerMail = modalSetData.userEmail;
        modalSetData.workerType = "user";
      }
      setModalData(modalSetData);
      setIsOpen(true);
    },
    [isOpen, modalData]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [isOpen]);

  const handleShowAlert = (name) => {
    toast.success(`Message Has been sent to ${name} `, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 3000,
      // hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: true,
    });
  };

  const showAlert = (isMoving, prevIsMoving) => {
    alert("User not moving");

    // You can add more conditions or logic here based on your requirements
  };

  const iconUrl =
    "https://firebasestorage.googleapis.com/v0/b/karzame-f00a9.appspot.com/o/Van.jpg?alt=media&token=bc3ed248-6b66-489f-9d76-095f08181c9e ";
  const params = useParams();

  const CustomToast = ({ icon, message, phone }) => (
    <div style={styles.toastContainer}>
      <img src={icon} alt="Icon" style={styles.toastImage} />
      <div>
        <span style={styles.messageTxt}>{message}</span>
        <span style={styles.phoneNumber}>{phone}</span>
      </div>
    </div>
  );

  const styles = {
    toastContainer: {
      display: "flex",
      alignItems: "center",
      borderRadius: "8px", // Adjust the border-radius as needed
      margin: "5px", // Adjust the margin as needed
    },
    toastImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%", // Make the image circular
      marginRight: "9px", // Add margin to the right if needed
    },
    messageTxt: {
      color: "#555", // Set the co
      display: "block",
      fontSize: "16px", // Adjust the font size as needed
    },
    phoneNumber: {
      color: "#555", // Set the co
      display: "block",
      marginTop: "5px", // Adjust the margin as needed
      fontSize: "12px", // Adjust the font size as needed
    },
  };
  const fetchUserData = useCallback(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${params.id}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const liveLocation = {
          lat: userData.LiveLatitude,
          lng: userData.LiveLongitude,
        };
        setCenter(liveLocation);

        const escortData = userData.ShortDistance_Escort;
        if (escortData) {
          for (const key in escortData) {
            const shortInfo = escortData[key];
            setOrigin({ lat: shortInfo.Latitude, lng: shortInfo.Longitude });
            setDestination(center);
            // const stopInfo = shortInfo.stop;
            // if (stopInfo) {
            //   for (const stopKey in stopInfo) {
            //     const stop = stopInfo[stopKey];
            //     setDestination({ lat: stop.stopLatitude, lng: stop.stopLongitude });
            //   }
            //}

          }
        }
      }
    });
  }, [userId]);

  const fetchData = useCallback(async () => {
    const db = getDatabase();
    const starCountRef = ref(db, `users/${params.id}`);
    onValue(starCountRef, (snapshot) => {
      console.log("fetch data by id", snapshot.val());
      const isMoving = snapshot.val().IsMoving;
      // alert (isMoving)
      // if ( isMoving == false  ) {
      // // showAlert(isMoving);
      // toast.warning( `${snapshot.val().userName} Is Stopped`)
      // setPrevIsMoving(isMoving);
      // }
     const userData = snapshot.val();
      const liveLocation = {
        lat: userData.LiveLatitude,
        lng: userData.LiveLongitude,
      };
      setCenter(liveLocation);

      const escortData = userData.ShortDistance_Escort;
      if (escortData) {
        for (const key in escortData) {
          const shortInfo = escortData[key];
          setOrigin({ lat: shortInfo.Latitude, lng: shortInfo.Longitude });
          setDestination(center);
        }
    }
      if (isMoving && !prevIsMoving) {
        // The user is currently moving, and was not moving previously

        toast.info(
          <CustomToast
            phone={snapshot.val().userPhone}
            message={`${snapshot.val().userName} starts moving`}
            icon={userImg}
          />,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 10000,
          }
        );
        setUserPhone(snapshot.val().userPhone);
        setStatus(`${snapshot.val().userName} starts moving`);
      } else if (!isMoving) {
        // The user is currently not moving, and was moving previously

        toast.info(
          <CustomToast
            phone={snapshot.val().userPhone}
            message={`${snapshot.val().userName} stopped moving`}
            icon={mapicon}
          />,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 10000,
          }
        );
        setUserPhone(snapshot.val().userPhone);
        setStatus(`${snapshot.val().userName} stopped moving`);
      }

      setPrevIsMoving(isMoving);

      setCenter({
        lat: snapshot.val().LiveLatitude,
        lng: snapshot.val().LiveLongitude,
      });
      setUser(snapshot.val());
      // Set the location link using the user's latitude and longitude
      const link = `https://www.google.com/maps/place/${snapshot.val().LiveLatitude},${
        snapshot.val().LiveLongitude
      }`;
      setLocationLink(link);
      setUserImg(snapshot.val().userImage);

      getOperators(snapshot.val()?.LiveLatitude, snapshot.val()?.LiveLongitude, 500);
    });
  }, [nearUsers, Distanse, prevIsMoving]);

  const getOperators = (lat1, long1, distance) => {
    setNearUsers([]);
    const db = getDatabase();
    const starCountRef = ref(db, `Operators/`);
    onValue(starCountRef, (snapshot) => {
      Object.values(snapshot.val()).map((item) => {
        const { latitude, longitude } = item;
        const dist = calculateDistance(lat1, long1, latitude, longitude);
        console.log(item.Latitude, item.Longitude, item.workerName, "distance", dist);
        if (dist <= Distanse && item.key !== params.id && item.verified) {
          const nearData = item;
          nearData.distance = dist;
          setNearUsers((prev) => [...prev, nearData]);
          console.log(item);
        }
      });
    });
    console.log("near user ", nearUsers);
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  const handleSendNoti = () => {
    if (notiUsers.length == 0) {
      alert("please select a user first");
    } else {
      notiUsers.map((item) => {
        const data = nearUsers[item];
        console.log("notif mao", data);
        if (data?.workerTokenToken) {
          sendNotification(data?.workerTokenToken, data?.workerName, data, params.id);
        }
        handleShowAlert(data?.workerName);
      });
    }
  };


  const calculateRoute = async () => {
    if (!origin || !destination) {
      toast.error("Please provide both origin and destination.");
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].Distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      toast.error("Failed to calculate route.");
      console.error("Directions API Error:", error);
    }
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const ImageOverlay = ({ position, imageUrl, item, type = null }) => {
    const imageStyle = {
      width: "50px",
      height: "50px",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: 0,
      left: 0,
    };

    const AnimatedMarker = ({ position, title, imageUrl }) => {
      const [animatedPosition, setAnimatedPosition] = useState(position);

      const props = useSpring({
        from: { lat: animatedPosition.lat, lng: animatedPosition.lng },
        to: { lat: position.lat, lng: position.lng },
        config: { duration: 1000 }, // Adjust the duration as needed
        onFrame: ({ lat, lng }) => setAnimatedPosition({ lat, lng }),
      });

      return (
        <animated.div
          style={{
            position: "absolute",
            transform: `translate(${props.lng}px, ${props.lat}px)`,
          }}
        >
          <Marker title={title}>
            <ImageOverlay
              position={{ lat: position.lat, lng: position.lng }}
              imageUrl={imageUrl}
              item={user}
              type={"user"}
            />
          </Marker>
        </animated.div>
      );
    };

    return (
      <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={() => ({ x: -25, y: -25 })} // Adjust offset if needed
      >
        <div style={imageStyle} onClick={() => openModal(item, type)}>
          {/* {userData === "truck" ? ( */}
            <img
              height={50}
              width={50}
              style={{ backgroundSize: "contain", marginLeft: 20 }}
              className="rounded-circle"
              src={imageUrl}
              alt="Marker Image"
            />
          {/* ) : (
            <LottieAnimation width={80} height={80} />
          )} */}
        </div>
      </OverlayView>
    );
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setNotiUsers((prev) => [...prev, e.target.value]);
      console.log("prev", notiUsers);
    } else {
      setNotiUsers([notiUsers.filter((item) => item !== e.target.value)]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, [Distanse]);

  useEffect(() => {
    renderNoti();
  }, []);

  if (!isLoaded) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
      >
        <h1>Loading the map</h1>
      </div>
    );
  }
  return (
    <>
      {user?.LiveLatitude && user?.LiveLongitude ? (
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "1000px",
          }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >

{/* <Box position="relative" height="100vh" width="100vw"> */}
    
        {/* <Marker
          position={center}
          icon={{
            url: mapicon,
            scaledSize: new window.google.maps.Size(50, 50), // Set desired width and height
            origin: new window.google.maps.Point(0, 0), // Specify the origin point
            anchor: new window.google.maps.Point(25, 25), // Set anchor point at the center
          }}
        /> */}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      

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
          {Distanse && `Distance: ${Distanse}`}
          {duration && `Duration: ${duration}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={calculateRoute}>
              Calculate Route
            </Button>
          </Grid>
        
        </Grid>
      </Paper>
    {/* </Box> */}
          <div
            class="position-relative ms-auto float-right"
            style={{ left: window.innerWidth - 80, top: 60 }}
          >
            <button
              class="btn btn-dark d-flex"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#demo"
            >
              <img src={require("../../assets/menu.png")} />
            </button>
          </div>
          <ToastContainer />

          {user && (
            <Marker
              onClick={() => openModal(user, "user")}
              position={{ lat: user?.LiveLatitude, lng: user?.LiveLongitude }}
              title={user?.workerName}
              // animation={window.google.maps.Animation.DROP}
              animation={5}
            >
              {/* <LottieAnimation width={500} height={500} /> */}

              <ImageOverlay
                position={{ lat: user.LiveLatitude, lng: user.LiveLongitude }}
                imageUrl={mapicon}
                item={user}
                type={"user"}
              />
            </Marker>
          )}

          {/* {user && (
          <AnimatedMarker
            position={{ lat: user?.LiveLatitude, lng: user?.LiveLongitude }}
            title={user?.workerName}
            imageUrl={mapicon}
          />
        )} */}

          {nearUsers &&
            nearUsers.map((item) => {
              return (
                <>
                  <Marker
                    position={{ lat: item?.Latitude, lng: item?.Longitude }}
                    title={item?.workerName}
                  >
                    <ImageOverlay
                      position={{ lat: item?.Latitude, lng: item?.Longitude }}
                      imageUrl={item?.workerImage}
                      item={item}
                    />
                  </Marker>
                </>
              );
            })}
        </GoogleMap>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <h2>User did not started live location yet.</h2>
        </div>
      )}
      {isOpen && (
        <div className="">
          <div
            className="modal d-flex cont"
            style={{
              height: "auto",
              width: 280,
              alignSelf: "center",
              marginLeft: (window.innerWidth * 40) / 100,
              marginRight: (window.innerWidth * 40) / 100,
              marginTop: 40,
              marginBottom: 30,
            }}
          >
            <div className="modal-content">
              <div style={{ height: 40 }}>
                <h6
                  onClick={closeModal}
                  className="border"
                  style={{
                    textAlign: "center",
                    marginRight: 10,
                    marginTop: 0,
                    marginLeft: "auto",
                    width: 20,
                    borderRadius: 40 / 2,
                  }}
                >
                  X
                </h6>
              </div>
              <div>
                <div>
                  <div className="row col-12 justify-content-center align-item-center">
                    <div className="col-6">
                      <img
                        width={150}
                        height={80}
                        style={{ borderRadius: 10 }}
                        src={modalData?.workerImage}
                      />
                    </div>
                  </div>
                  <div
                    className="row   mx-2 align-items-baseline p-1 ms-auto me-auto"
                    style={{ width: "90%", marginBottom: 2, height: 280 }}
                  >
                    <div className="pb-3 mb-3">
                      <p className="text-dark text-left mt-2 ms-3" style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Name :</span>
                        {modalData?.workerName}
                      </p>
                      <p
                        className="text-dark text-left ms-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Subscription:</span>
                        {modalData?.subscription}
                      </p>
                      <p
                        className="text-dark text-left ms-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Type:</span>
                        {modalData?.userGSM}
                      </p>
                      <p
                        className="text-dark text-left ms-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Phone:</span>
                        {modalData?.workerPhoneNumber}
                      </p>
                      <p
                        className="text-dark text-left ms-3 pb-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Email:</span>
                        {modalData?.userEmail}
                      </p>
                      <p
                        className="text-dark text-left ms-3 pb-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Location Link:</span>
                        <a href={locationLink} target="_blank" rel="noopener noreferrer">
                          Open in Google Maps
                        </a>
                      </p>

                      <p
                        className="text-dark text-left ms-3 pb-3"
                        style={{ fontSize: 12, marginTop: -10 }}
                      >
                        <span style={{ fontWeight: "bold", marginRight: 10 }}>Status:</span>
                        {status}
                      </p>
                    </div>
                    {/* <div className="col" style={{ fontSize: 11 }}></div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div class="offcanvas offcanvas-end" id="demo">
        <div class="offcanvas-header">
          <h1 class="offcanvas-title h3">Available Providers </h1>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="row col-11 me-auto ms-auto mb-3 mt-3">
          <input
            className="form-control"
            type="number"
            placeholder="Enter distance in Km"
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
        {nearUsers.length == 0 ? (
          <div>
            <p className="mt-3 text-center mx-2" style={{ fontSize: 13 }}>
              Provider not found near this user
            </p>
          </div>
        ) : (
          nearUsers.map((item, index) => {
            // console.log("map usern", item);
            return (
              <div key={index}>
                <div
                  className="row col-12 mx-2 align-item-baseline border ps-4   pt-3 ms-auto me-auto"
                  style={{ width: "90%", borderRadius: 10, marginBottom: 1 }}
                >
                  <div className="col-1 me-2">
                    <input
                      value={index}
                      className="form-check-input mt-2 me-4"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-2">
                    <img
                      width={40}
                      height={40}
                      style={{ borderRadius: 20 }}
                      src={item.workerImage}
                    />
                  </div>
                  <div className="col" style={{ fontSize: 11 }}>
                    <p style={{}}>
                      <span className="fw-bolder fs-6">{item?.workerName}</span>
                      <br />
                      {item?.distance.toFixed(1)} Km away from {user.userName}
                    </p>
                    {/* <p style={{ marginTop: -17 }}>
                      {item?.distance.toFixed(1)} Km away from {user.userName}
                    </p> */}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {nearUsers.length > 0 && (
          <button
            onClick={handleSendNoti}
            type="submit"
            className="text-center btn-lg btn-success mt-3 h5 btn border w-75 text-center ms-auto me-auto"
          >
            Send Location
          </button>
        )}
      </div>
    </>
  );
}

export default FinalMap;
