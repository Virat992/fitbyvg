import { db } from "../services/firebase.js";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

async function addRolesToEmailUsers() {
  const usersSnap = await getDocs(collection(db, "users"));

  for (const userDoc of usersSnap.docs) {
    const userId = userDoc.id; // email is the ID
    const userData = userDoc.data();

    if (!userData.role) {
      await setDoc(
        doc(db, "users", userId),
        { role: "user" }, // or "coach" for admins
        { merge: true }
      );
      console.log(`Role added for user: ${userId}`);
    }
  }
}

addRolesToEmailUsers();
