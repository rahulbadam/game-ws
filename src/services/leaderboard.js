import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const saveScore = async (game, player, score) => {
  await addDoc(collection(db, "leaderboard"), {
    game,
    player,
    score,
    createdAt: serverTimestamp(),
  });
};

export const getTopScores = async (game) => {
  const q = query(
    collection(db, "leaderboard"),
    where("game", "==", game),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};
