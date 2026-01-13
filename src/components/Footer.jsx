import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm py-4 w-full fixed bottom-0 left-0 z-40">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-xs">&copy; {new Date().getFullYear()} Game WS</div>
        <div className="flex items-center gap-2 text-xs">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="text-gray-600">|</span>
          <Link to="/about" className="hover:text-white">About</Link>
          <span className="text-gray-600">|</span>
          <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
          <span className="text-gray-600">|</span>
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <span className="text-gray-600">|</span>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
