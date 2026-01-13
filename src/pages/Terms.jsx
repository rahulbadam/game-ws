export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent animate-bounce-gentle">
          📜 Terms & Conditions
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
          Rules and guidelines for using GameWS
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl animate-slide-in-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-400">📋 Agreement to Terms</h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          Welcome to GameWS! By accessing and using this website, you agree to be bound by these
          Terms and Conditions. Please read them carefully before using our services.
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
          These terms govern your use of our free online games and website. If you do not agree
          with any part of these terms, please do not use our services.
        </p>
      </div>

      {/* Game Usage */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-400">🎮 Game Usage</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">🎯</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Entertainment Only</h3>
              <p className="text-gray-400">
                All games on GameWS are provided solely for entertainment purposes.
                They are designed to be fun, casual gaming experiences.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">🚫</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Content Restrictions</h3>
              <p className="text-gray-400">
                You may not copy, distribute, modify, or create derivative works of any game content
                without explicit written permission from GameWS.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">👤</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">User Conduct</h3>
              <p className="text-gray-400">
                Use our games responsibly and respectfully. Do not attempt to exploit, hack, or
                disrupt the normal functioning of our games.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liability & Disclaimers */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-red-400">⚖️ Liability & Disclaimers</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">🛡️</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">No Warranty</h3>
              <p className="text-gray-400">
                GameWS games are provided "as is" without any warranties, express or implied.
                We do not guarantee uninterrupted or error-free gameplay.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">💰</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Limitation of Liability</h3>
              <p className="text-gray-400">
                GameWS shall not be liable for any direct, indirect, incidental, or consequential
                damages arising from your use of our games or website.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">🎲</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Gaming Risks</h3>
              <p className="text-gray-400">
                While our games are designed for entertainment, excessive gaming may have negative
                effects. Please game responsibly and take regular breaks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intellectual Property */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">©️ Intellectual Property</h2>
        <p className="text-purple-100 text-base md:text-lg leading-relaxed mb-4">
          All content on GameWS, including games, graphics, logos, and code, are the intellectual
          property of GameWS or our licensors.
        </p>
        <p className="text-purple-100 text-base md:text-lg leading-relaxed">
          You may not reproduce, distribute, or create derivative works without explicit permission.
          Fair use for personal, non-commercial purposes is generally allowed.
        </p>
      </div>

      {/* User Data & Privacy */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400">🔒 User Data & Privacy</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">📊 Score Tracking</h3>
            <p className="text-gray-400 text-sm">
              We track game scores locally in your browser for leaderboard purposes.
              No personal data is transmitted.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🍪 Cookies</h3>
            <p className="text-gray-400 text-sm">
              Third-party cookies may be used for advertising.
              See our Privacy Policy for details.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🌐 Local Storage</h3>
            <p className="text-gray-400 text-sm">
              Game progress and scores are stored locally in your browser.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🔄 Data Control</h3>
            <p className="text-gray-400 text-sm">
              You can clear local storage anytime through your browser settings.
            </p>
          </div>
        </div>
      </div>

      {/* Termination */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400">🚪 Termination</h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
          We reserve the right to terminate or suspend your access to GameWS at our discretion,
          without prior notice, for any reason including violation of these terms.
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          Upon termination, your right to use our services will cease immediately.
        </p>
      </div>

      {/* Governing Law */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">⚖️ Governing Law</h2>
        <p className="text-indigo-100 text-base md:text-lg leading-relaxed mb-4">
          These Terms and Conditions are governed by and construed in accordance with applicable laws.
          Any disputes will be resolved through appropriate legal channels.
        </p>
        <p className="text-indigo-100 text-base md:text-lg leading-relaxed">
          We strive to resolve any issues amicably and encourage users to contact us first
          for any concerns or disputes.
        </p>
      </div>

      {/* Acceptance */}
      <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">✅ Acceptance</h2>
        <p className="text-green-100 text-base md:text-lg leading-relaxed mb-4">
          By continuing to use GameWS, you acknowledge that you have read, understood, and agree
          to be bound by these Terms and Conditions.
        </p>
        <p className="text-green-100 text-base md:text-lg leading-relaxed">
          These terms may be updated periodically. We encourage you to review them regularly.
          Your continued use after changes constitutes acceptance of the new terms.
        </p>
        <div className="mt-6 p-4 bg-green-950 rounded-lg">
          <p className="text-green-200 text-sm italic text-center">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
}
