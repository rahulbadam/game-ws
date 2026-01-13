import { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "🎮 Are these games free?",
      answer: "Yes! All GameWS games are completely free to play. No hidden costs, subscriptions, or in-app purchases. You can play any game as many times as you want without spending a dime.",
      category: "pricing"
    },
    {
      id: 2,
      question: "📝 Do I need to register or create an account?",
      answer: "No registration required! Simply visit the website and start playing immediately. Your game scores are saved locally in your browser for leaderboard purposes, but no personal information is collected or stored.",
      category: "account"
    },
    {
      id: 3,
      question: "📱 Do games work on mobile devices?",
      answer: "Absolutely! All GameWS games are fully optimized for mobile phones, tablets, and desktop computers. The games use touch controls on mobile and mouse/keyboard on desktop. No downloads or special apps needed - play directly in your browser.",
      category: "compatibility"
    },
    {
      id: 4,
      question: "💾 Are my game scores saved?",
      answer: "Yes! Your scores are automatically saved in your browser's local storage. You can track your progress across gaming sessions, and scores contribute to the global leaderboards. Note that clearing your browser data will reset your local scores.",
      category: "progress"
    },
    {
      id: 5,
      question: "🌐 Can I play without an internet connection?",
      answer: "Once a game loads, you can play offline! However, you'll need internet to initially load the game and to save scores to leaderboards. The games are designed to work with intermittent connections.",
      category: "connectivity"
    },
    {
      id: 6,
      question: "🎯 How do the leaderboards work?",
      answer: "Leaderboards track the top scores for each game. Your scores are saved locally and contribute to global rankings. You can see how you compare with other players, and it encourages friendly competition!",
      category: "features"
    },
    {
      id: 7,
      question: "🔒 Is my data safe and private?",
      answer: "Yes! GameWS takes privacy seriously. We don't collect personal information, and all games run locally in your browser. Scores are stored anonymously, and we don't share any data with third parties. Check our Privacy Policy for full details.",
      category: "privacy"
    },
    {
      id: 8,
      question: "⚡ Why are the games so fast to load?",
      answer: "We use modern web technologies and lazy loading to ensure games load quickly. Only the game you want to play is loaded when you click on it, keeping initial page load times fast and efficient.",
      category: "performance"
    },
    {
      id: 9,
      question: "🎨 Can I suggest new games or features?",
      answer: "Definitely! We love hearing from our community. Use the Contact page to send us your ideas for new games, features, or improvements. Many of our best ideas come from player feedback!",
      category: "feedback"
    },
    {
      id: 10,
      question: "🐛 What should I do if I find a bug?",
      answer: "If you encounter any issues, please contact us through the Contact page with details about the game, your device/browser, and steps to reproduce the problem. We'll investigate and fix it as quickly as possible.",
      category: "support"
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: "❓" },
    { id: "pricing", name: "Pricing", icon: "💰" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "compatibility", name: "Compatibility", icon: "📱" },
    { id: "progress", name: "Progress", icon: "📊" },
    { id: "connectivity", name: "Connectivity", icon: "🌐" },
    { id: "features", name: "Features", icon: "⚙️" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "performance", name: "Performance", icon: "⚡" },
    { id: "feedback", name: "Feedback", icon: "💬" },
    { id: "support", name: "Support", icon: "🛠️" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = selectedCategory === "all"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | GameWS</title>
        <meta
          name="description"
          content="Find answers to common questions about GameWS games, accounts, mobile compatibility, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent animate-bounce-gentle">
            ❓ Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
            Everything you need to know about GameWS
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 animate-slide-in-left">
          <h2 className="text-2xl font-bold mb-4 text-green-400">📂 Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
                  }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 animate-slide-in-right">
          {filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className={`bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in animate-stagger-${(index % 5) + 1}`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-300"
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                <span className={`text-2xl transform transition-transform duration-300 ${openFAQ === faq.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ${openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">🤔 Still have questions?</h2>
            <p className="text-blue-100 text-lg mb-6">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              📞 Contact Us
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 animate-slide-in-left">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎮</div>
            <div className="text-2xl font-bold text-blue-400">5+</div>
            <div className="text-gray-400">Games Available</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-green-400">∞</div>
            <div className="text-gray-400">Players Worldwide</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-gray-400">Cost to Play</div>
          </div>
        </div>
      </div>
    </>
  );
}
