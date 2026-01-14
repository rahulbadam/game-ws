import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export function useLeaderboard(gameId) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Use global leaderboard instead of individual game scores
    const q = query(
      collection(db, "global_scores"),
      orderBy("score", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScores(snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })));
    });

    return () => unsubscribe();
  }, [gameId]); // Keep gameId dependency for consistency

  return scores;
}
