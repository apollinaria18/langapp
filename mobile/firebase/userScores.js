// firebase/userScores.js
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const saveUserScore = async (folderName, score) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userRef = doc(db, "userScores", user.uid);

    // ⬇️ тут важно: setDoc с merge:true обновит значение
    await setDoc(userRef, {
      [folderName]: score,   // всегда будет перезаписывать значение
    }, { merge: true });

    console.log("✅ Score saved:", folderName, score);
  } catch (error) {
    console.error("❌ Error saving score:", error);
  }
};

export const getUserScore = async (folderName, partId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userRef = doc(db, "userScores", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data()[folderName];
      if (data && typeof data === "object") {
        return data[partId] || 0; // ✅ возвращаем число для partId
      }
      return 0;
    }
    return 0;
  } catch (error) {
    console.error("❌ Error getting score:", error);
    return 0;
  }
};

