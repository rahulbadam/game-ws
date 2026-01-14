import { createContext, useContext, useEffect, useState } from "react";
import { observeAuth, logout } from "./auth";
import { updateGlobalScore } from "../services/leaderboard";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext(null);

// Award daily login bonus (50 points once per day)
const awardDailyLoginBonus = async (user) => {
  if (!user) return;

  const today = new Date().toDateString();
  const bonusRef = doc(db, "daily_bonuses", user.uid);

  try {
    const bonusSnap = await getDoc(bonusRef);
    const lastLoginDate = bonusSnap.exists() ? bonusSnap.data().lastLoginDate : null;

    // Award bonus if it's a new day
    if (lastLoginDate !== today) {
      const username = user.displayName || user.email?.split('@')[0] || 'Player';

      // Award 50 points for daily login
      await updateGlobalScore(user.uid, username, {
        type: 'daily_bonus',
        points: 50,
        countAsGame: false
      });

      // Update last login date
      await setDoc(bonusRef, {
        lastLoginDate: today,
        userId: user.uid,
        lastUpdated: new Date()
      });

      console.log("Daily login bonus awarded: +50 points");

      // Show bonus message after welcome message
      setTimeout(() => {
        if (window.snackbarContext) {
          window.snackbarContext.showSuccess("🎁 Daily login bonus: +50 points!");
        }
      }, 2000);
    }
  } catch (error) {
    console.error("Failed to award daily login bonus:", error);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    return observeAuth(async (u) => {
      // Check if this is a login (user went from null to user)
      if (!user && u) {
        setJustLoggedIn(true);

        // Award daily login bonus
        try {
          await awardDailyLoginBonus(u);
        } catch (error) {
          console.error("Failed to award daily login bonus:", error);
        }

        // Show welcome message
        setTimeout(() => {
          if (window.snackbarContext) {
            const displayName = u.displayName || u.email?.split('@')[0] || 'Player';
            window.snackbarContext.showSuccess(`Welcome back, ${displayName}! 🎮`);
          }
          setJustLoggedIn(false);
        }, 1000); // Small delay to ensure snackbar is ready
      }

      setUser(u);
      setLoading(false);
    });
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      // Show success message
      if (window.snackbarContext) {
        window.snackbarContext.showSuccess("Successfully logged out!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (window.snackbarContext) {
        window.snackbarContext.showError("Failed to logout. Please try again.");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
