import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAdwT1n0vIFG8W2GCIWSsTK5LpwcCfLtgo",
  authDomain: "karzame-f00a9.firebaseapp.com",
  databaseURL: "https://karzame-f00a9-default-rtdb.firebaseio.com",
  projectId: "karzame-f00a9",
  storageBucket: "karzame-f00a9.appspot.com",
  messagingSenderId: "551367851869",
  appId: "1:551367851869:web:673e54bbb35e8aee3032b4",
  measurementId: "G-TBEJTGK2YJ"
};

const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, db, storage , dataBase };
// export { fStore };
