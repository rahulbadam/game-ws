export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent animate-bounce-gentle">
          🔒 Privacy Policy
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
          How we protect and respect your privacy
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl animate-slide-in-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-400">📋 About This Policy</h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          GameWS is committed to protecting your privacy. This website provides free online browser games
          for entertainment purposes only. We take your privacy seriously and are transparent about
          our data practices.
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
          This privacy policy explains what information we collect, how we use it, and your rights
          regarding your personal data.
        </p>
      </div>

      {/* Information Collection */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400">📊 Information We Collect</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">🌐</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Browser & Device Information</h3>
              <p className="text-gray-400">
                We may collect non-personal information such as browser type, operating system,
                screen resolution, and device type to optimize your gaming experience.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">📈</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Usage Statistics</h3>
              <p className="text-gray-400">
                Anonymous usage data helps us understand which games are popular and how to
                improve our platform for better user experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cookies Section */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-400">🍪 Cookies & Advertising</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">🎯</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Third-Party Cookies</h3>
              <p className="text-gray-400 mb-2">
                We work with advertising partners who use cookies to serve relevant ads based on your interests.
              </p>
              <p className="text-gray-400 text-sm">
                These cookies help support our free gaming platform.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
            <span className="text-3xl">📢</span>
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">Google AdSense</h3>
              <p className="text-gray-400 mb-2">
                Google uses the DoubleClick cookie to serve ads and measure ad performance.
              </p>
              <p className="text-gray-400 text-sm">
                You can opt out of personalized advertising through Google's Ad Settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Security */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">🔐 Data Security</h2>
        <p className="text-purple-100 text-base md:text-lg leading-relaxed mb-4">
          We implement appropriate security measures to protect your information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>
        <p className="text-purple-100 text-base md:text-lg leading-relaxed">
          Since we don't collect personal information, your privacy is inherently protected. All games run
          locally in your browser without transmitting personal data.
        </p>
      </div>

      {/* Your Rights */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400">⚖️ Your Rights</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">📋 Access Your Data</h3>
            <p className="text-gray-400 text-sm">
              You can request information about any data we hold about you.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🚫 Opt Out</h3>
            <p className="text-gray-400 text-sm">
              You can disable cookies and opt out of personalized advertising.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">📞 Contact Us</h3>
            <p className="text-gray-400 text-sm">
              Questions about privacy? Reach out to us anytime.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🔄 Updates</h3>
            <p className="text-gray-400 text-sm">
              We'll notify you of any significant policy changes.
            </p>
          </div>
        </div>
      </div>

      {/* Agreement */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">📜 Agreement</h2>
        <p className="text-orange-100 text-base md:text-lg leading-relaxed mb-4">
          By using GameWS, you agree to this Privacy Policy. We may update this policy occasionally,
          and continued use of our services constitutes acceptance of any changes.
        </p>
        <p className="text-orange-100 text-base md:text-lg leading-relaxed">
          If you have any questions about this privacy policy or our data practices,
          please contact us through our contact page.
        </p>
        <div className="mt-6 p-4 bg-orange-950 rounded-lg">
          <p className="text-orange-200 text-sm italic text-center">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
}
