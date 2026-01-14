import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PlayGame from "./pages/PlayGame";
import Profile from "./pages/Profile";
import "./index.css";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Login from "./login/Login";
import Signup from "./login/Signup";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import UserDropdown from "./components/UserDropdown";
import Snackbar from "./components/Snackbar";
import { useAuth } from "./login/AuthContext";
import { useSnackbar } from "./contexts/SnackbarContext";
import { getUserGlobalScore } from "./services/leaderboard";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const { user, logout } = useAuth();
  const { snackbar, hideSnackbar } = useSnackbar();
  const [userScore, setUserScore] = useState(0);

  // Real-time score updates when user changes
  useEffect(() => {
    let unsubscribe = null;

    if (user) {
      // Set up real-time listener for user's global score
      const scoreRef = doc(db, "global_scores", user.uid);
      unsubscribe = onSnapshot(scoreRef, (doc) => {
        if (doc.exists()) {
          const scoreData = doc.data();
          setUserScore(scoreData.score || 0);
        } else {
          setUserScore(0);
        }
      }, (error) => {
        console.error("Failed to listen to score changes:", error);
        setUserScore(0);
      });
    } else {
      setUserScore(0);
    }

    // Cleanup listener on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      // Snackbar will be shown from AuthContext
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Fixed Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-3 md:px-4 py-2 md:py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Mobile: Hamburger Menu | Desktop: Logo/Brand */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Hamburger Menu - Mobile Only */}
            <button className="md:hidden p-1.5 text-white hover:text-gray-300 hover:bg-gray-800 rounded-md transition-all duration-200">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo/Brand - Desktop */}
            <Link to="/" className="hidden md:block text-lg md:text-xl font-bold text-green-400 hover:text-green-300 transition-colors">
              🎮 GameWS
            </Link>

            {/* Mobile Logo */}
            <Link to="/" className="md:hidden text-base md:text-lg font-bold text-green-400 hover:text-green-300 transition-colors">
              🎮
            </Link>
          </div>

          {/* User Dropdown - Desktop & Mobile */}
          {user && (
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Global Score Display - Desktop */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-lg">
                <span className="text-yellow-400 text-sm font-medium">🟡</span>
                <span className="text-white text-sm font-bold">{userScore}</span>
              </div>

              {/* Global Score Display - Mobile */}
              <div className="md:hidden flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-lg">
                <span className="text-yellow-400 text-xs">🟡</span>
                <span className="text-white text-xs font-bold">{userScore}</span>
              </div>

              <UserDropdown user={user} onLogout={handleLogout} />
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen flex flex-col">
        <main className="flex-grow pb-20 bg-black pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play/:gameId" element={<PlayGame />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
      </div>

      {/* Snackbar */}
      {snackbar.visible && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          duration={snackbar.duration}
          onClose={hideSnackbar}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
