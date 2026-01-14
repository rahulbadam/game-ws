import { register } from "./auth";
import { createUserProfile } from "./userService";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { updateProfile } from "firebase/auth";
import { auth } from "./auth";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;

    try {
      const cred = await register(email, password);

      // Set displayName in Firebase Auth profile
      await updateProfile(cred.user, {
        displayName: username
      });

      await createUserProfile(cred.user.uid, username, false);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | GameWS</title>
        <meta name="description" content="Create a free GameWS account to save your progress and compete on leaderboards." />
      </Helmet>

      <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              📝 Join GameWS
            </h1>
            <p className="text-gray-300 text-lg">
              Create your free account
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl animate-slide-in-right">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  👤 Username
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Choose a username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📧 Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🔒 Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Minimum 6 characters"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-950 border border-red-800 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-gray-400 mb-4">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🔐 Sign In
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-green-950 rounded-lg border border-green-800 animate-fade-in-up">
            <h3 className="font-semibold text-green-300 mb-2">🎁 Account Benefits</h3>
            <ul className="text-sm text-green-200 space-y-1">
              <li>• Save your game progress</li>
              <li>• Compete on global leaderboards</li>
              <li>• Unlock achievements</li>
              <li>• Sync across devices</li>
            </ul>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6 animate-fade-in-up">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Games
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
