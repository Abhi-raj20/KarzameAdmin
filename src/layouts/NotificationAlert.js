import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";

// Add a variable to store the IDs of the alerts that have been shown

function renderNoti() {
  // let shownAlerts = [];
  // const dataBase = getDatabase();
  // const usersRef = ref(dataBase, "/users");
  // onValue(usersRef, (snapshot) => {
  //   const users = snapshot.val();
  //   Object.entries(users).forEach(([userId, userData]) => {
  //     if (userData?.SOS) {
  //       const sosData = userData.SOS;
  //       const unreadSOSKeys = Object.keys(sosData).filter(
  //         (key) => sosData[key].isRead === false && !shownAlerts.includes(key)
  //       );
  //       if (unreadSOSKeys.length > 0) {
  //         const userNames = unreadSOSKeys.map((key) => users[userId].userName);
  //         // toast.warning(
  //         //   <div>
  //         //     <div>
  //         //       {userNames.join(", ")} need emergency help,
  //         //       <br />
  //         //       {/* <a href={`/UserProfile/${userId}`}>see Profile</a>. */}
  //         //       <Link style={{ color: "black" }} to={`/UserProfile/${userId}`}>
  //         //         see profile{" "}
  //         //       </Link>
  //         //     </div>
  //         //   </div>,
  //         //   {
  //         //     autoClose: 3000,
  //         //     position: toast.POSITION.TOP_CENTER,
  //         //   }
  //         // );
  //         unreadSOSKeys.forEach((key) => {
  //           sosData[key].isRead = true;
  //           shownAlerts.push(key);
  //         });
  //         // Update the database with the modified SOS data
  //         set(ref(dataBase, `/users/${userId}/SOS`), sosData);
  //       }
  //     }
  //   });
  // });
}

export const renderPoliceAlert = () => {
  let shownAlerts = [];
  const dataBase = getDatabase();
  const usersRef = ref(dataBase, "/users");
  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();

    Object.entries(users).forEach(([userId, userData]) => {
      if (userData?.Police_Alerts) {
        const policeAlerts = userData.Police_Alerts;

        Object.entries(policeAlerts).forEach(([alertId, alertData]) => {
          if (!shownAlerts.includes(alertId) && !alertData.isRead) {
            console.log("police alert", userData);

            // toast.warn(
            //   <div>
            //     <div>
            //       {userData.userName.toUpperCase()} asking for {alertData.Type},<br />
            //       <a href={`/UserProfile/${userId}`}>see Profile</a>.
            //     </div>
            //   </div>,
            //   {
            //     autoClose: 3000,

            //     position: toast.POSITION.TOP_CENTER,
            //   }
            // );

            shownAlerts.push(alertId);

            // Update the isRead property in the database
            const alertRef = ref(dataBase, `/users/${userId}/Police_Alerts/${alertId}`);
            set(alertRef, { ...alertData, isRead: true });
          }
        });
      }
    });
  });
};

// export const renderPoliceAlert = () => {
//   let shownAlert = [];
//   const dataBase = getDatabase();
//   const usersRef = ref(dataBase, "/users");
//   onValue(usersRef, (snapshot) => {
//     const users = snapshot.val();

//     Object.entries(users).forEach(([userId, userData]) => {
//       if (userData?.Police_Alerts) {
//         const policeAlerts = userData.Police_Alerts;

//         Object.entries(policeAlerts).forEach(([alertId, alertData]) => {
//           console.log("police alert", userData);

//           if (Object.values(alertData) && !shownAlert.includes(alertId)) {
//             toast.warn(
//               <div>
//                 <div>
//                   {userData.userName.toUpperCase()} asking for {alertData.Type},<br />
//                   <a href={`/UserProfile/${userId}`}>see Profile</a>.
//                 </div>
//               </div>,
//               {
//                 autoClose: 3000,

//                 position: toast.POSITION.TOP_CENTER,
//               }
//             );

//             shownAlert.push(alertId);

//             // Update the isRead property in the database
//             const alertRef = ref(dataBase, `/users/${userId}/Police_Alerts/${alertId}`);
//             set(alertRef, { ...alertData, isRead: true });
//           }
//         });
//       }
//     });
//   });
// };

export default renderNoti;
