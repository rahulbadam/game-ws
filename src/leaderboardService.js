import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function submitScore(gameId, user, username, score) {
  await addDoc(
    collection(db, "leaderboards", gameId, "scores"),
    {
      uid: user.uid,
      username,
      score,
      createdAt: serverTimestamp(),
    }
  );
}

