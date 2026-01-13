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

export const saveScore = async (game, userId, username, score) => {
  try {
    console.log("Firebase saveScore called with:", { game, userId, username, score });

    // 🔑 One document per game+user
    const docId = `${game}_${userId}`;
    const scoreRef = doc(db, "leaderboard", docId);

    const existingSnap = await getDoc(scoreRef);

    if (!existingSnap.exists()) {
      // First time score
      await setDoc(scoreRef, {
        game,
        userId,
        username,
        score,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const existingScore = existingSnap.data().score;

      // Update only if score is higher
      if (score > existingScore) {
        await setDoc(
          scoreRef,
          {
            score,
            username,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        console.log("Score not higher, skipping update");
      }
    }

    return { id: docId };
  } catch (error) {
    console.error("Firebase saveScore error:", error);

    // 🔁 Local fallback (unchanged)
    console.log("Saving locally as fallback");
    const localScores = JSON.parse(localStorage.getItem("localLeaderboard") || "[]");

    const existingIndex = localScores.findIndex(
      s => s.game === game && s.userId === userId
    );

    if (existingIndex === -1) {
      localScores.push({
        game,
        userId,
        username,
        score,
        createdAt: new Date().toISOString(),
        local: true,
      });
    } else if (score > localScores[existingIndex].score) {
      localScores[existingIndex].score = score;
      localScores[existingIndex].updatedAt = new Date().toISOString();
    }

    localStorage.setItem("localLeaderboard", JSON.stringify(localScores));
    return { id: "local-" + Date.now(), local: true };
  }
};

export const getTopScores = async (game) => {
  try {
    const q = query(
      collection(db, "leaderboard"),
      where("game", "==", game),
      orderBy("score", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const firebaseScores = snapshot.docs.map(doc => doc.data());

    // Get local scores as fallback
    const localScores = JSON.parse(localStorage.getItem('localLeaderboard') || '[]')
      .filter(score => score.game === game)
      .map(score => ({ ...score, local: true }));

    // Combine and sort all scores
    const allScores = [...firebaseScores, ...localScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log("Combined scores:", allScores);
    return allScores;
  } catch (error) {
    console.error("Firebase getTopScores error:", error);
    // Return local scores only
    const localScores = JSON.parse(localStorage.getItem('localLeaderboard') || '[]')
      .filter(score => score.game === game)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    console.log("Returning local scores:", localScores);
    return localScores;
  }
};
