import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm py-4 w-full fixed bottom-0 left-0 z-40 border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-xs animate-pulse">
          &copy; {new Date().getFullYear()} <span className="font-bold text-blue-400">Game WS</span>
        </div>
        <nav className="flex items-center gap-3 text-xs">
          <Link
            to="/"
            className="hover:text-white hover:scale-110 transition-all duration-300 relative group"
          >
            Home
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <span className="text-gray-600 animate-pulse">|</span>
          <Link
            to="/about"
            className="hover:text-white hover:scale-110 transition-all duration-300 relative group"
          >
            About
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <span className="text-gray-600 animate-pulse">|</span>
          <Link
            to="/faq"
            className="hover:text-white hover:scale-110 transition-all duration-300 relative group"
          >
            FAQ
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <span className="text-gray-600 animate-pulse">|</span>
          <Link
            to="/privacy-policy"
            className="hover:text-white hover:scale-110 transition-all duration-300 relative group"
          >
            Privacy
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <span className="text-gray-600 animate-pulse">|</span>
          <Link
            to="/terms"
            className="hover:text-white hover:scale-110 transition-all duration-300 relative group"
          >
            Terms
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <span className="text-gray-600 animate-pulse">|</span>
          <Link
            to="/contact"
            className="hover:text-white hover:scale-110 transition-all duration-300 relative group"
          >
            Contact
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
        </nav>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 animate-shimmer pointer-events-none"></div>
    </footer>
  );
}
