export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-rose-600 bg-clip-text text-transparent animate-bounce-gentle">
          📞 Contact Us
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
          We'd love to hear from you!
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl animate-slide-in-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-pink-400">💬 Get In Touch</h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          Have questions about our games? Found a bug? Want to suggest new features?
          We'd love to hear your feedback and help make GameWS better for everyone.
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
          Reach out to us using any of the methods below. We typically respond within 24-48 hours.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-400">📮 Contact Methods</h2>
        <div className="space-y-6">
          {/* Email */}
          <div className="flex items-start space-x-4 p-6 bg-gray-800 rounded-lg border-l-4 border-blue-500">
            <span className="text-4xl">📧</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-xl mb-2">Email Support</h3>
              <p className="text-gray-400 mb-3">
                Send us an email for questions, feedback, or technical support.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:rahulbadam000@gmail.com"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  📧 Send Email
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText("rahulbadam000@gmail.com")
                      .then(() => alert("Email copied!"))
                      .catch(() => alert("Copy failed. Email: rahulbadam000@gmail.com"));
                  }}
                  className="ml-3 inline-block bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg"
                >
                  📋 Copy Email
                </button>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-start space-x-4 p-6 bg-gray-800 rounded-lg border-l-4 border-green-500">
            <span className="text-4xl">⏰</span>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-xl mb-2">Response Time</h3>
              <p className="text-gray-400">
                We aim to respond to all inquiries within 24-48 hours during business days.
                For urgent technical issues, please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Can Help With */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-400">🤝 How Can We Help?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🐛 Bug Reports</h3>
            <p className="text-gray-400 text-sm">
              Found a glitch or error? Let us know the game, device, and steps to reproduce.
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">💡 Feature Requests</h3>
            <p className="text-gray-400 text-sm">
              Have ideas for new games or improvements? We'd love to hear them!
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🎮 Game Questions</h3>
            <p className="text-gray-400 text-sm">
              Need help understanding how to play a game? Ask away!
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-2">🤝 Partnerships</h3>
            <p className="text-gray-400 text-sm">
              Interested in collaborating or advertising? Get in touch.
            </p>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">🌟 Community Guidelines</h2>
        <p className="text-indigo-100 text-base md:text-lg leading-relaxed mb-4">
          GameWS is built by gamers for gamers. We value respectful communication and constructive feedback.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h4 className="font-semibold text-white mb-1">Be Respectful</h4>
            <p className="text-indigo-200 text-sm">Treat others with kindness</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-white mb-1">Be Specific</h4>
            <p className="text-indigo-200 text-sm">Provide clear, detailed feedback</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="font-semibold text-white mb-1">Be Constructive</h4>
            <p className="text-indigo-200 text-sm">Help us improve together</p>
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400">❓ Quick Answers</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-white mb-1">Are the games free?</h3>
            <p className="text-gray-400 text-sm">Yes! All GameWS games are completely free to play.</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-white mb-1">Do I need to register?</h3>
            <p className="text-gray-400 text-sm">No registration required. Just visit and start playing!</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-white mb-1">Are scores saved?</h3>
            <p className="text-gray-400 text-sm">Game scores are saved locally in your browser for leaderboards.</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-950 rounded-lg">
          <p className="text-yellow-200 text-sm text-center">
            Can't find what you're looking for? <a href="mailto:rahulbadam000@gmail.com" className="underline hover:text-yellow-100">Contact us directly</a>
          </p>
        </div>
      </div>
    </div>
  );
}
