// import { Card } from "@mui/material";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
// import MDBox from "components/MDBox";
// import BasicLayout from "layouts/authentication/components/BasicLayout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { GoogleMap, InfoBox, Marker, OverlayView, useJsApiLoader } from "@react-google-maps/api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarMenu, { SidebarMenuNav } from "react-bootstrap-sidebar-menu";

import { useSpring, animated } from "react-spring";

import mapicon from "../../assets/images/mapIcon.jpg";

import lottie from "lottie-web";
import animationData from "./../../assets/Lottie/Siren.json";
import soundFile from "./../../Raw/Siren.wav";

import "./map.css";
import { sendNotification } from "./notification";
import renderNoti from "layouts/NotificationAlert";
import { renderPoliceAlert } from "layouts/NotificationAlert";

function LocateTrack() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg",
  });
  var { lat, long } = useParams();
  const [center, setCenter] = useState({ lat: Number(lat), lng: Number(long) });
  const [user, setUser] = useState(null);
  const [nearUsers, setNearUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notiUsers, setNotiUsers] = useState([]);
  const [modalData, setModalData] = useState();

  const [Distanse, setDistance] = useState(1000);

  const queryParams = new URLSearchParams(window.location.search);
  const userData = queryParams.get("userData");

  const openModal = useCallback(
    (data, type) => {
      // alert(type)
      let modalSetData = data;
      if (type == "user") {
        modalSetData.workerImage = modalSetData.userImage;
        modalSetData.workerName = modalSetData.userName;
        modalSetData.workerPhoneNumber = modalSetData.userPhone;
        modalSetData.workerType = "user";
      }
      setModalData(data);
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

  const iconUrl =
    "https://firebasestorage.googleapis.com/v0/b/karzame-f00a9.appspot.com/o/Van.jpg?alt=media&token=bc3ed248-6b66-489f-9d76-095f08181c9e ";
  const params = useParams();

  // const { sosData } = useParams();
  var { lat, long } = useParams();

  const LottieAnimation = ({ width, height }) => {
    const audio = useRef(new Audio(soundFile));
    const containerRef = useRef(null);

    useEffect(() => {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg", // Use 'svg' for better performance
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      return () => {
        // Clean up the audio when the component unmounts
        audio.current.pause();
        audio.current.currentTime = 0;
      };
    }, []);

    useEffect(() => {
      audio.current.loop = true;
      audio.current.play();
    }, []);

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

  // const fetchData = useCallback(async () => {
  //   const db = getDatabase();
  //   const starCountRef = ref(db, `users/${params.id}`);
  //   onValue(starCountRef, (snapshot) => {
  //     console.log("fetch data by id", snapshot.val());

  //     setCenter({
  //       lat: snapshot.val().LiveLatitude,
  //       lng: snapshot.val().LiveLongitude,
  //     });
  //     setUser(snapshot.val());
  //     getOperators(snapshot.val()?.LiveLatitude, snapshot.val()?.LiveLongitude, 500);
  //   });
  // }, [nearUsers, Distanse]);

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
          {userData === "truck" ? (
            <LottieAnimation width={80} height={80} />
           
          ) : (
            <img
              height={50}
              width={50}
              style={{ backgroundSize: "contain", marginLeft: 20 }}
              className="rounded-circle"
              src={imageUrl}
              alt="Marker Image"
            />
          )}
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

  // useEffect(() => {
  //   fetchData();
  // }, [Distanse]);

  useEffect(() => {
    renderNoti();
  }, []);

  if (!isLoaded) {
    return <h1>Loading the map </h1>;
  }
  return (
    <>
      {lat && long ? (
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "1000px",
          }}
        >
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

          <Marker
            position={{ lat: Number(lat), lng: Number(long) }}
            // title={user?.workerName}
            // animation={window.google.maps.Animation.DROP}
            animation={5}
          >
            <ImageOverlay
              position={{ lat: lat, lng: long }}
              imageUrl={mapicon}
              item={user}
              type={"user"}
            />{" "}
            *
          </Marker>

          {/* {user && (
          <AnimatedMarker
            position={{ lat: user?.LiveLatitude, lng: user?.LiveLongitude }}
            title={user?.workerName}
            imageUrl={mapicon}
          />
        )} */}

          {/* {nearUsers &&
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
          })} */}
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
          <h2>Map not available because coordinates not available</h2>
        </div>
      )}
    </>
  );
}

export default LocateTrack;
