import { Link } from 'react-router-dom';
import { Map, Mail, Heart } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/5 dark:bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img src="/images/logo.png" alt="VTRIPS Logo" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                VTRIPS
              </span>
            </Link>
            <p className="opacity-70 text-sm max-w-sm leading-relaxed font-medium">
              The ultimate AI-powered trip planner built exclusively for VIT Chennai students. Plan budget-friendly, personalized itineraries in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider opacity-90 mb-2">Explore</h4>
            <Link to="/" className="text-sm opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors font-medium">Home</Link>
            <Link to="/planner" className="text-sm opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors font-medium">AI Planner</Link>
            <Link to="/dashboard" className="text-sm opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors font-medium">Saved Trips</Link>
          </div>

          {/* Contact & Socials */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider opacity-90 mb-2">Connect</h4>
            <a href="https://github.com/varga21" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors font-medium">
              <FaGithub size={16} /> GitHub
            </a>
            <a href="mailto:contact@vtrip.com" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 hover:text-primary-500 transition-colors font-medium">
              <Mail size={16} /> Contact Us
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-60 font-medium">
            &copy; {new Date().getFullYear()} VTRIP. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs opacity-80 font-medium bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
            <span>Built with</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span>for VIT Chennai students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
