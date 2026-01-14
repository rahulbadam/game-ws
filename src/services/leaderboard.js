import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Global score system with penalties and rewards
export const updateGlobalScore = async (userId, username, gameResult) => {
  try {
    console.log("Updating global score:", { userId, username, gameResult });

    const scoreRef = doc(db, "global_scores", userId);
    const existingSnap = await getDoc(scoreRef);

    let currentScore = 0;
    if (existingSnap.exists()) {
      currentScore = existingSnap.data().score || 0;
    }

    let newScore = currentScore;

    // Apply scoring logic based on game result
    if (gameResult.type === 'win') {
      newScore += 10; // +10 for winning
    } else if (gameResult.type === 'loss') {
      newScore -= 10; // -10 for losing
    } else if (gameResult.type === 'entry_fee') {
      newScore += gameResult.points || -10; // Deduct entry fee (usually -10)
    } else if (gameResult.type === 'snake_entry') {
      newScore -= 10; // -10 entry fee for snake
    } else if (gameResult.type === 'snake_food') {
      newScore += gameResult.points || 1; // +1 per food eaten
    }

    console.log(`Score change: ${currentScore} → ${newScore} (${gameResult.type})`);

    // Update or create score document
    await setDoc(scoreRef, {
      userId,
      username,
      score: newScore,
      gamesPlayed: (existingSnap.data()?.gamesPlayed || 0) + (gameResult.countAsGame ? 1 : 0),
      updatedAt: serverTimestamp(),
      createdAt: existingSnap.data()?.createdAt || serverTimestamp(),
    }, { merge: true });

    console.log("Global score updated:", newScore);
    return newScore;

  } catch (error) {
    console.error("Firebase updateGlobalScore error:", error);
    throw error;
  }
};

// Get top global scores for leaderboard
export const getGlobalTopScores = async () => {
  const q = query(
    collection(db, "global_scores"),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  const scores = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }));

  console.log("Global scores:", scores);
  return scores;
};

// Get user's current global score
export const getUserGlobalScore = async (userId) => {
  const scoreRef = doc(db, "global_scores", userId);
  const snap = await getDoc(scoreRef);

  if (snap.exists()) {
    return snap.data();
  }

  return { score: 0, gamesPlayed: 0 };
};
