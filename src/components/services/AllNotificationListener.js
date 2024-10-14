import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { db } from "../../firebase";
import { showStyledToast } from "components/toastAlert";
import { useNavigate } from "react-router-dom";

export const listenForNewSosWithNotification = () => {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  onChildChanged(usersRef, (snapshot) => {
    const user = snapshot.val();
    const { userName } = user;

    if (user.SOS) {
      const sosData = user.SOS;

      for (const sosId in sosData) {
        const sosItem = sosData[sosId];

        if (!sosItem.isRead) {
          // Show a notification for the new unread SOS
          // toast.warning(`${userName} Needs Emergency Help`, { autoClose: 3000 });

          // Mark the SOS as read
          const sosRef = child(ref(db, `users/${user.uid}/SOS`), sosId);
          update(sosRef, { isRead: true });
        }
      }
    }
  });
};

export function listenToNewWellBeingData(ONClICK) {
  try {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    // Listen for changes in the 'users' reference
    onChildAdded(usersRef, (userSnapshot) => {
      const user = userSnapshot.val();
      const userId = userSnapshot.key;

      // Check if the user has 'wellBeingServicesData'
      if (user.wellBeingServicesData) {
        const wellBeingServicesDataRef = ref(db, `users/${userId}/wellBeingServicesData`);

        // Listen for new child nodes added to 'wellBeingServicesData' for this user
        onChildAdded(wellBeingServicesDataRef, (dataSnapshot) => {
          const newData = dataSnapshot.val();
          console.log("new data ", newData);
          // Check if 'isRead' doesn't exist or is set to false
          if (!newData.isRead) {
            // Show a toast indicating that the data hasn't been read
            console.log(`New Data Added for User ${userId}:`, newData);
            const wellBeingCheckId = dataSnapshot.key;
            // showStyledToast(
            //   "info",
            //   `WellBeing Check alert`,
            //   `${newData.Name} asking for Wellbeing Check`,
            //   ONClICK,
            // )

            // Update the 'isRead' field to true using the 'set' method
            const dataPath = `users/${userId}/wellBeingServicesData/${dataSnapshot.key}/isRead`;
            const updates = {};
            updates[dataPath] = true;
            update(ref(db), updates);
          } else {
            // Data has already been read
            console.log(`Data already read for User ${userId}:`, newData);
          }

          // You can take further action here with the new data
        });
      }
    });
  } catch (error) {
    console.error("Error listening to new wellBeingServicesData:", error);
  }
}
