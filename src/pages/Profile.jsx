import { useState, useEffect } from 'react';
import { useAuth } from '../login/AuthContext';
import { getUserProfile, updateUserProfile } from '../login/userService';
import { useSnackbar } from '../contexts/SnackbarContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    displayName: '',
    bio: '',
    favoriteGame: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        setProfile({
          username: userProfile.username || '',
          displayName: userProfile.displayName || user.displayName || '',
          bio: userProfile.bio || '',
          favoriteGame: userProfile.favoriteGame || ''
        });
      } else {
        // Set defaults if no profile exists
        setProfile({
          username: '',
          displayName: user.displayName || user.email?.split('@')[0] || '',
          bio: '',
          favoriteGame: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update Firebase Auth displayName if username changed
      if (profile.username && profile.username !== user.displayName) {
        await updateProfile(user, {
          displayName: profile.username
        });
      }

      // Update Firestore profile
      await updateUserProfile(user.uid, profile);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile Settings | GameWS</title>
      </Helmet>

      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Games</span>
            </Link>
            <h1 className="text-2xl font-bold text-green-400">👤 Profile Settings</h1>
          </div>

          {/* User Info Card */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {(profile.displayName || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.displayName || 'User'}</h2>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500">Member since {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSave} className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Edit Profile</h3>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">This will be displayed on leaderboards</p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Favorite Game */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Favorite Game
                </label>
                <select
                  value={profile.favoriteGame}
                  onChange={(e) => handleInputChange('favoriteGame', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your favorite game</option>
                  <option value="snake">🐍 Snake</option>
                  <option value="tic-tac-toe">⭕ Tic Tac Toe</option>
                  <option value="rock-paper-scissors">✂️ Rock Paper Scissors</option>
                  <option value="memory-match">🧠 Memory Match</option>
                  <option value="whack-a-mole">🔨 Whack A Mole</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Account Info */}
          <div className="bg-gray-900 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">🔐 Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Created:</span>
                <span className="text-white">{new Date(user.metadata.creationTime).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Sign In:</span>
                <span className="text-white">{new Date(user.metadata.lastSignInTime).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
