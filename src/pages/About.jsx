export default function About() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-bounce-gentle">
          🎮 About GameWS
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
          Your go-to platform for free, instant browser games
        </p>
      </div>

      {/* Welcome Section */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl animate-slide-in-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-400">🏠 Welcome to GameWS</h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          GameWS is a simple and fun platform where you can play free online games directly in your browser.
          Our goal is to provide lightweight, fast, and enjoyable games that anyone can play without downloads,
          registrations, or complicated setup.
        </p>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
          Whether you have a few minutes to relax or want to challenge your skills, GameWS offers classic and
          casual games designed for all age groups.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-400">✨ Our Focus</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-semibold text-white">Simplicity</h3>
              <p className="text-gray-400 text-sm">Easy to understand, quick to learn</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-semibold text-white">Performance</h3>
              <p className="text-gray-400 text-sm">Fast loading, smooth gameplay</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
            <span className="text-2xl">📱</span>
            <div>
              <h3 className="font-semibold text-white">Mobile Friendly</h3>
              <p className="text-gray-400 text-sm">Optimized for all devices</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
            <span className="text-2xl">⚖️</span>
            <div>
              <h3 className="font-semibold text-white">Fair Gameplay</h3>
              <p className="text-gray-400 text-sm">Balanced and enjoyable for everyone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-400">🎮 Available Games</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🐍</div>
            <h3 className="font-bold text-white">Snake</h3>
            <p className="text-green-100 text-sm">Classic arcade action</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">⭕</div>
            <h3 className="font-bold text-white">Tic Tac Toe</h3>
            <p className="text-blue-100 text-sm">Strategic thinking game</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">✂️</div>
            <h3 className="font-bold text-white">Rock Paper Scissors</h3>
            <p className="text-red-100 text-sm">Quick decision making</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-bold text-white">Memory Match</h3>
            <p className="text-purple-100 text-sm">Test your memory skills</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🐹</div>
            <h3 className="font-bold text-white">Whack a Mole</h3>
            <p className="text-yellow-100 text-sm">Fast-paced arcade fun</p>
          </div>
        </div>
        <p className="text-gray-400 text-center mt-6">
          We continuously improve our games and add new ones to enhance your experience!
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">🌍 Our Mission</h2>
        <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-4">
          Our mission is to create a <span className="font-semibold text-white">safe, accessible, and enjoyable gaming experience</span> for everyone.
        </p>
        <p className="text-blue-100 text-base md:text-lg leading-relaxed">
          We believe games should be <span className="font-semibold text-white">easy to play, quick to load, and fun</span> without unnecessary distractions.
          GameWS is built with passion for gaming and a commitment to quality entertainment.
        </p>
      </div>

      {/* Compatibility Section */}
      <div className="bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-400">📱 Device Compatibility</h2>
        <p className="text-gray-300 text-base md:text-lg mb-6">
          GameWS games are optimized for all modern devices. No special plugins or installations required!
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-semibold text-white">Mobile Phones</h3>
            <p className="text-gray-400 text-sm">iOS & Android optimized</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-2">📲</div>
            <h3 className="font-semibold text-white">Tablets</h3>
            <p className="text-gray-400 text-sm">Touch-friendly interface</p>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-2">💻</div>
            <h3 className="font-semibold text-white">Desktop</h3>
            <p className="text-gray-400 text-sm">Mouse & keyboard support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
