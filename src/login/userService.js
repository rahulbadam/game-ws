import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function createUserProfile(uid, username, isGuest) {
  await setDoc(doc(db, "users", uid), {
    username,
    isGuest,
    createdAt: new Date(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, profileData) {
  await setDoc(doc(db, "users", uid), {
    ...profileData,
    updatedAt: new Date(),
  }, { merge: true });
}
