import { useState, useEffect, useMemo, useCallback } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import { Provider, useSelector } from "react-redux";
import store from "./Redux/Store/store";
import soundFile from "./Raw/ring.wav"; // Import your sound file

import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  onChildAdded,
  child,
  update,
  onChildChanged,
} from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { showStyledToast } from "components/toastAlert";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import "react-toastify/dist/ReactToastify.css";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Link, useNavigate } from "react-router-dom";

// Material Dashboard 2 React routes
import routes from "routes";

import SignIn from "layouts/authentication/sign-in";

import signInOnlyRoutes from "SignInroutes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { listenForNewSosWithNotification } from "components/services/AllNotificationListener";
import { listenToNewWellBeingData } from "components/services/AllNotificationListener";
import CustomNoti from "components/CustomNoti";
import VirtualTravelGuard from "components/VirtualTravelGuard";
import SecReqNoti from "components/SecReqNoti";
import SosModalCom from "components/SosModal";
import AlertModal from "components/AlerrtModal";
import TriggerModal from "components/TriggerModal";
import TriggerModal2 from "components/TriggerModal2";
import { getCurrentAdminState } from "Utils/Functions";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();
  const allData = useSelector((state) => state.data.allData);
  const [modals, setModals] = useState([]);

  const [virtual, setVirtual] = useState([]);

  const [secReq, secSecReq] = useState([]);

  const [sosModal, setSosModal] = useState([]);

  const [policeAlert, setPoliceAlert] = useState([]);

  const [triggersZoneAlert, setTriggersZoneAlert] = useState([]);
  const [triggersBatteryAlert, setTriggersBatteryAlert] = useState([]);

  const openVirtualModal = useCallback(
    (notification) => {
      setVirtual([...virtual, notification]);
    },
    [virtual]
  );

  const openSecReqModal = useCallback(
    (notification) => {
      secSecReq([...secReq, notification]);
    },
    [secReq]
  );

  const closePoliceAlertModal = useCallback(
    (index) => {
      const updatedModals = [...policeAlert];
      updatedModals.splice(index, 1);
      setPoliceAlert(updatedModals);
      const audio = new Audio(soundFile);
      audio.loop = false; // Disable looping
      audio.pause(); // Pause the audio
      audio.currentTime = 0; // Reset the audio to the beginning
    },
    [policeAlert]
  );

  const closeTriggerZoneAlertModal = useCallback(
    (index) => {
      const updatedModals = [...triggersZoneAlert];
      updatedModals.splice(index, 1);
      setTriggersZoneAlert(updatedModals);
    },
    [triggersZoneAlert]
  );

  const closeTriggerBatteryAlertModal = useCallback(
    (index) => {
      const updatedModals = [...triggersBatteryAlert];
      updatedModals.splice(index, 1);
      setTriggersBatteryAlert(updatedModals);
    },
    [triggersBatteryAlert]
  );

  const closeSecModal = useCallback(
    (index) => {
      const updatedModals = [...secReq];
      updatedModals.splice(index, 1);
      secSecReq(updatedModals);
    },
    [secReq]
  );

  const closeVirtualModal = useCallback(
    (index) => {
      const updatedModals = [...virtual];
      updatedModals.splice(index, 1);
      setVirtual(updatedModals);
    },
    [virtual]
  );

  const closeSosModal = useCallback(
    (index) => {
      const updatedModals = [...sosModal];
      updatedModals.splice(index, 1);
      setSosModal(updatedModals);
    },
    [sosModal]
  );

  const openModal = useCallback(
    (notification) => {
      setModals([...modals, notification]);
    },
    [modals]
  );

  // Function to close a modal
  const closeModal = useCallback(
    (index) => {
      const updatedModals = [...modals];
      updatedModals.splice(index, 1);
      setModals(updatedModals);
    },
    [modals]
  );

  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    loggedIn,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  async function listenToNewUsers() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");

      // Listen for new users added to the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const newUser = userSnapshot.val();
        const userId = userSnapshot.key;

        // Show a toast message for the new user

        showStyledToast("info", "New user created", `${newUser.userName}`, () => {});

        // You can also take other actions here with the new user data
        console.log(`New User Created: ${userId}`, newUser);
      });
    } catch (error) {
      console.error("Error listening to new users:", error);
    }
  }

  async function listenToNewSOSAlerts() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state
      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user has 'SOS' data

        if (
          user &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.SOS
        ) {
          const sosDataRef = ref(db, `users/${userId}/SOS`);

          // Listen for new child nodes added to 'SOS' for this user
          onChildAdded(sosDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read (for reference)
              console.log(`New SOS Alert Data for User ${userId}:`, newData);
              // Push the SOS data into sosModal state
              setSosModal((prev) => [
                ...prev,
                {
                  userId: userId,
                  sosData: newData,
                  userName: user.userName,
                  ...user,
                },
              ]);

              audio.play();
              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/SOS/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            } else {
              // Data has already been read
              // console.log(`SOS Alert Data already read for User ${userId}:`, newData);
            }

            // You can take further action here with the new SOS alert data
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new SOS alerts:", error);
    }
  }

  // function listenToNewSOSAlerts() {
  //   try {
  //     const db = getDatabase();
  //     const usersRef = ref(db, 'users');

  //     // Listen for changes in the 'users' reference
  //     onChildAdded(usersRef, (userSnapshot) => {
  //       const user = userSnapshot.val();
  //       const userId = userSnapshot.key;

  //       // Check if the user has 'SOS' data
  //       if (user.SOS) {
  //         const sosDataRef = ref(db, `users/${userId}/SOS`);

  //         // Listen for new child nodes added to 'SOS' for this user
  //         onChildAdded(sosDataRef, (dataSnapshot) => {
  //           const newData = dataSnapshot.val();
  //           // console.log("New SOS Alert Data:", newData);

  //           // Check if 'isRead' doesn't exist or is set to false
  //           if (!newData.isRead) {
  //             // Show a toast indicating that the data hasn't been read
  //             console.log(`New SOS Alert Data for User ${userId}:`, newData);
  //             const sosAlertId = dataSnapshot.key;
  //             showStyledToast(
  //               "info",
  //               "SOS Alert",
  //               `SOS Alert from ${user.userName}`,
  //               () => {
  //                 navigate(`/UserProfile/${userId}`);
  //               }
  //             );

  //             // Update the 'isRead' field to true using the 'set' method
  //             const dataPath = `users/${userId}/SOS/${dataSnapshot.key}/isRead`;
  //             const updates = {};
  //             updates[dataPath] = true;
  //             update(ref(db), updates);
  //           } else {
  //             // Data has already been read
  //             // console.log(`SOS Alert Data already read for User ${userId}:`, newData);
  //           }

  //           // You can take further action here with the new SOS alert data
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error listening to new SOS alerts:', error);
  //   }
  // }

  useEffect(() => {
    // setMiniSidenav(dispatch, true )

    setOnMouseEnter(true);
    // showStyledToast(
    //   "info",
    //   "SOS Alert",
    //   `SOS Alert from test `,
    //   () => {
    //   }
    // );
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    // Listen for changes in the 'users' node
    const unsubscribe = onChildAdded(usersRef, (userSnapshot) => {
      const user = userSnapshot.val();

      // Check if the user_seen property exists and is false
      if (user.user_seen === undefined || user.user_seen === false) {
        // Show a toast for the new user
        showStyledToast("info", "New User Added", `A new user has signed up`, () => {
          // Your callback function if needed
        });

        // Mark the user as seen in the database
        // update(ref(usersRef, `${userSnapshot.key}/user_seen`), true);

        const dataPath = `users/${userSnapshot.key}/user_seen`;
        const updates = {};
        updates[dataPath] = true;
        update(ref(db), updates);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function listenToNewPoliceAlerts() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");

      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user has 'Police_Alerts' data

        if (
          user &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.Police_Alerts
        ) {
          const policeAlertsDataRef = ref(db, `users/${userId}/Police_Alerts`);

          // Listen for new child nodes added to 'Police_Alerts' for this user
          onChildAdded(policeAlertsDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            // console.log("New Police Alert Data:", newData);

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              setPoliceAlert((prev) => [
                ...prev,
                {
                  ...user,
                  userId: userId,
                  ...newData,
                  userName: user.userName,
                },
              ]);
              // Show a toast indicating that the data hasn't been read
              // console.log(`New Police Alert Data for User ${userId}:`, newData);
              const policeAlertId = dataSnapshot.key;
              // showStyledToast("info", "Police Alert", `Police Alert from ${user.userName}`, () => {
              //   navigate(`/UserProfile/${userId}`);
              // });
              audio.play();
              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/Police_Alerts/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            } else {
              // Data has already been read
              // console.log(`Police Alert Data already read for User ${userId}:`, newData);
            }

            // You can take further action here with the new Police alert data
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new Police alerts:", error);
    }
  }

  async function listenToNewVirtualHomeCheckData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state
      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, (userSnapshot) => {
        const user = userSnapshot.val();
        console.log("user data t virtual home chek", user);
        const userId = userSnapshot.key;
        // console.log("user at vietual", user)
        // Check if the user has 'VirtualHomeCheck' data

        if (
          user &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.VirtualHomeCheck
        ) {
          const virtualHomeCheckDataRef = ref(db, `users/${userId}/VirtualHomeCheck`);

          // Listen for new child nodes added to 'VirtualHomeCheck' for this user
          onChildAdded(virtualHomeCheckDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            const newObj = { ...newData, ...user, userId: userId };

            console.log("vir home check", newObj);

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              const virtualHomeCheckId = dataSnapshot.key;

              // Check if the key is not one of the excluded values
              if (
                virtualHomeCheckId !== "currentLiveLatVirtual" &&
                virtualHomeCheckId !== "currentLiveLogVirtual"
              ) {
                setModals((prev) => [...prev, newObj]);
                audio.play();
                // Show a toast indicating that the data hasn't been read
                // showStyledToast(
                //   "info",
                //   "Virtual Home Check",
                //   `${user.userName} asking for Virtual Home Check`,
                //   () => {
                //     navigate(`/UserProfile/${userId}`);
                //   }
                // );

                // Update the 'isRead' field to true using the 'set' method
                const dataPath = `users/${userId}/VirtualHomeCheck/${dataSnapshot.key}/isRead`;
                const updates = {};
                updates[dataPath] = true;
                update(ref(db), updates);
              }
            } else {
              // Data has already been read
            }

            // You can take further action here with the new VirtualHomeCheck data
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new VirtualHomeCheck data:", error);
    }
  }

  function listenToUserStatus() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");

      // Listen for changes in the 'users' reference
      onChildChanged(usersRef, (userSnapshot) => {
        const userId = userSnapshot.key;
        const user = userSnapshot.val();

        const status = ref(db, `users/${userId}`);

        onChildAdded(status, (dataSnapshot) => {
          const newData = dataSnapshot.val();
          alert(JSON.stringify(newData));
          // Check if the user has an IsMoving key and is explicitly set to false
          // if (newData.IsMoving !== undefined && newData.IsMoving === false) {
          //   // Show a toast indicating that the status has changed
          //   showStyledToast("info", "User Status", `${newData.userName} has stopped`);
          // } else if (newData.IsMoving) {
          //   // Show a toast indicating that the status has changed
          //   showStyledToast("info", "User Status", `${newData.userName} is moving`);
          // }
        });

        console.log("User Data:", user); // Log user data to the console
      });
    } catch (error) {
      console.error("Error listening to user status data:", error);
    }
  }

  async function listenToNewWhistleBlowData() {
    // console.log("listenToNewWhistleBlowData---->");
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, async (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        // Check if the user state matches the current admin state
        if (
          user.userState &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.Whistle_Blow
        ) {
          const whistleBlowDataRef = ref(db, `users/${userId}/Whistle_Blow`);

          // Listen for new child nodes added to 'Whistle_Blow' for this user
          onChildAdded(whistleBlowDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              const whistleBlowId = dataSnapshot.key;

              setPoliceAlert((prev) => [
                ...prev,
                {
                  ...user,
                  userId: userId,
                  userName: user.userName,
                  ...newData,
                },
              ]);

              // Play the audio once
              audio.play();

              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/Whistle_Blow/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new whistle-blow data:", error);
    }
  }

  function listenToNewZonePssedData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, async (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

        // Check if the user state matches the current admin state
        if (
          user.userState &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.GeoFence
        ) {
          const geoFenceDataRef = ref(db, `users/${userId}/GeoFence`);

          // Listen for new child nodes added to 'GeoFence' for this user
          onChildAdded(geoFenceDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              const geoFenceId = dataSnapshot.key;

              setTriggersZoneAlert((prev) => [
                ...prev,
                {
                  ...user,
                  userId: userId,
                  userName: user.userName,
                  ...newData,
                },
              ]);
              audio.play();
              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/GeoFence/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new -GeoFence data:", error);
    }
  }

  function listenToNewBatteryData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, async (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

        // Check if the user state matches the current admin state
        if (
          user.userState &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.BatteryLevels
        ) {
          const batteryDataRef = ref(db, `users/${userId}/BatteryLevels`);

          // Listen for new child nodes added to 'BatteryLevels' for this user
          onChildAdded(batteryDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              const batteryId = dataSnapshot.key;

              setTriggersBatteryAlert((prev) => [
                ...prev,
                {
                  ...user,
                  userId: userId,
                  userName: user.userName,
                  ...newData,
                },
              ]);

              audio.play();
              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/BatteryLevels/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new -BatteryLevels data:", error);
    }
  }

  function listenToNewWellBeingData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, async (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

        // Check if the user state matches the current admin state
        if (
          user.userState &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.wellBeingServicesData
        ) {
          const wellBeingServicesDataRef = ref(db, `users/${userId}/wellBeingServicesData`);

          // Listen for new child nodes added to 'wellBeingServicesData' for this user
          onChildAdded(wellBeingServicesDataRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();
            newData.LiveLatitude = user.LiveLatitude;
            newData.LiveLongitude = user.LiveLongitude;

            // Check if 'isRead' doesn't exist or is set to false
            if (!newData.isRead) {
              // Show a toast indicating that the data hasn't been read
              newData.userId = userId;
              const wellBeingCheckId = dataSnapshot.key;
              setVirtual((prev) => [...prev, newData]);
              audio.play();
              // Update the 'isRead' field to true using the 'set' method
              const dataPath = `users/${userId}/wellBeingServicesData/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new wellBeingServicesData:", error);
    }
  }

  function listenToNewScurity_agent_requestsData() {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const audio = new Audio(soundFile);
      // audio.loop = true; // Enable looping for the audio

      // const audio = new Audio(soundFile);

      // Listen for changes in the 'users' reference
      onChildAdded(usersRef, async (userSnapshot) => {
        const user = userSnapshot.val();
        const userId = userSnapshot.key;

        const currentAdminState = await getCurrentAdminState(); // Dynamically fetch the admin's state

        // Check if the user state matches the current admin state and if they have 'Scurity_agent_requests'
        if (
          user.userState &&
          (allData || user.userState.toLowerCase() === currentAdminState.toLowerCase()) &&
          user.Scurity_agent_requests
        ) {
          const Scurity_agent_requestsRef = ref(db, `users/${userId}/Scurity_agent_requests`);

          // Listen for new child nodes added to 'Scurity_agent_requests' for this user
          onChildAdded(Scurity_agent_requestsRef, (dataSnapshot) => {
            const newData = dataSnapshot.val();

            // Merge the user and newData objects
            const mergedData = { ...user, ...newData, userId: userId };

            // Check if 'isRead' doesn't exist or is set to false
            if (!("isRead" in newData) || newData.isRead === false) {
              // Mark the data as read
              const dataPath = `users/${userId}/Scurity_agent_requests/${dataSnapshot.key}/isRead`;
              const updates = {};
              updates[dataPath] = true;
              update(ref(db), updates);

              // Do something with the merged data only if it's not read
              console.log("New Scurity_agent_request Added for User", userId, ":", mergedData);
              // audio.play();
              // You can add this data to your state if needed
              // For example, if you have a state variable like 'secSecReq' to store notifications:
              secSecReq((prev) => [...prev, mergedData]);
              audio.play();
              // You can also display a notification or take other actions here
              // showStyledToast("info", "Scurity_agent_request alert", `${mergedData.Name} has a new Scurity_agent_request`, () => {
              //   navigate(`/Scurity_agent_requestSingleUser/${userId}/${dataSnapshot.key}`);
              // });
            }
          });
        }
      });
    } catch (error) {
      console.error("Error listening to new Scurity_agent_requests:", error);
    }
  }

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    if (!loggedIn) {
      return () => null;
    }
    listenToNewUsers();

    // listenToUserStatus();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      return () => null;
    }
    listenToNewWhistleBlowData();
    listenToNewWellBeingData();

    // listenToUserStatus();
  }, [loggedIn, allData]);

  useEffect(() => {
    if (!loggedIn) {
      return () => null;
    }

    listenToNewSOSAlerts();
    listenToNewPoliceAlerts();

    // listenToUserStatus();
  }, [loggedIn, allData]);

  useEffect(() => {
    if (!loggedIn) {
      return () => null;
    }

    listenToNewVirtualHomeCheckData();
    listenToNewZonePssedData();

    // listenToUserStatus();
  }, [loggedIn, allData]);

  useEffect(() => {
    if (!loggedIn) {
      return () => null;
    }

    listenToNewBatteryData();
    listenToNewScurity_agent_requestsData();
    // listenToUserStatus();
  }, [loggedIn, allData]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <>
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ToastContainer />
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            <ToastContainer />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Karzame"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
                {configsButton}
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              {getRoutes(routes)}
              {!loggedIn ? (
                <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
              ) : (
                <Route path="*" element={<Navigate to="/dashbord" />} />
              )}
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Karzame"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(routes)}
            {!loggedIn ? (
              <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}

            {/* <Route path="*" element={<Navigate to="/authentication/sign-in" />} /> */}
          </Routes>
          <ToastContainer />

          {modals.map((notification, index) => (
            <div className="position-relative">
              <CustomNoti
                index={index}
                key={index}
                isOpen={true}
                onClose={() => closeModal(index)}
                notification={notification}
                type={"Virtual Home Check "}
              />
            </div>
          ))}
          {virtual.map((notification, index) => (
            <div className="position-relative">
              <VirtualTravelGuard
                index={index}
                key={index}
                isOpen={true}
                onClose={() => closeVirtualModal(index)}
                notification={notification}
                type={"Virtual travel Guard "}
              />
            </div>
          ))}

          {secReq.map((notification, index) => (
            <div className="position-relative">
              <SecReqNoti
                index={index}
                key={index}
                isOpen={true}
                onClose={() => closeSecModal(index)}
                notification={notification}
                type={"Virtual travel Guard "}
              />
            </div>
          ))}

          {sosModal.map((notification, index) => (
            <div className="position-relative">
              <SosModalCom
                index={index}
                key={index}
                isOpen={true}
                onClose={() => closeSosModal(index)}
                notification={notification}
                type={"Modal"}
              />
            </div>
          ))}

          {policeAlert.map(
            (notification, index) => (
              console.log("item at mao", notification),
              (
                <div className="position-relative">
                  <AlertModal
                    index={index}
                    key={index}
                    isOpen={true}
                    onClose={() => closePoliceAlertModal(index)}
                    notification={notification}
                    type={"Modal"}
                  />
                </div>
              )
            )
          )}

          {triggersZoneAlert.map(
            (notification, index) => (
              console.log("item at triggersZoneAlert", notification),
              (
                <div className="position-relative">
                  <TriggerModal2
                    icon={true}
                    onCloseTrigger={() => closeTriggerZoneAlertModal(index)}
                    triggerModal={true}
                    triggerModalData={notification}
                    triggerTitle={"Virtual Guard Alert Zone Passed"}
                  />
                </div>
              )
            )
          )}

          {triggersBatteryAlert.map(
            (notification, index) => (
              console.log("item at triggersBatteryAlert", notification),
              (
                <div className="position-relative">
                  <TriggerModal2
                    icon={false}
                    onCloseTrigger={() => closeTriggerBatteryAlertModal(index)}
                    triggerModal={true}
                    triggerModalData={notification}
                    triggerTitle={"Virtual Guard Alert Low Battery"}
                  />
                </div>
              )
            )
          )}
        </ThemeProvider>
      )}
    </>
  );
}
