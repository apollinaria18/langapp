import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export const getUserDictionary = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return {};

  const ref = doc(db, "dictionaries", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  } else {
    return {};
  }
};

// ✅ новый addWordToUserDictionary
export const addWordToUserDictionary = async (folderName, wordObj) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "dictionaries", user.uid);

  await updateDoc(ref, {
    [folderName]: arrayUnion(wordObj),
  }).catch(async (e) => {
    // если документа ещё нет → создаём
    if (e.code === "not-found") {
      await setDoc(ref, {
        [folderName]: [wordObj],
      });
    } else {
      throw e;
    }
  });
};
