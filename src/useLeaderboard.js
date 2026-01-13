import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export function useLeaderboard(gameId) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "leaderboard"),
      where("game", "==", gameId),
      orderBy("score", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [gameId]);

  return scores;
}
