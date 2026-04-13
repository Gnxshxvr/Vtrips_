import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Moon, Sun, Map, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase';
import { useEffect } from 'react';

export default function Navbar() {
  const { theme, toggleTheme, user, setUser, setIsAuthModalOpen } = useStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!supabase) return;
    
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
         const name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
         setUser({ name, initial: name.charAt(0).toUpperCase(), email: session.user.email });
      }
    });

    // Listen for changes on auth state (login, signout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
         const name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
         setUser({ name, initial: name.charAt(0).toUpperCase(), email: session.user.email });
      } else {
         setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleLoginToggle = async () => {
    if (user) {
      if (supabase) {
        await supabase.auth.signOut();
      } else {
        setUser(null);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="bg-black/10 dark:bg-white/5 backdrop-blur-xl mx-auto max-w-7xl mt-4 px-6 py-3 rounded-2xl flex items-center justify-between border border-white/10 shadow-xl shadow-black/5">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/images/logo.png" alt="VTRIPS Logo" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
          <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            VTRIPS
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link 
            to="/planner" 
            className={`relative font-bold tracking-wide transition-colors hover:text-primary-500 group ${isActive('/planner') ? 'text-primary-500' : 'opacity-80'}`}
          >
            AI Planner
            <span className={`absolute left-0 -bottom-1.5 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left transition-transform duration-300 ${isActive('/planner') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
          </Link>
          <Link 
            to="/dashboard" 
            className={`relative font-bold tracking-wide transition-colors hover:text-primary-500 group ${isActive('/dashboard') ? 'text-primary-500' : 'opacity-80'}`}
          >
            Saved Trips
            <span className={`absolute left-0 -bottom-1.5 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left transition-transform duration-300 ${isActive('/dashboard') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <div onClick={handleLoginToggle} className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-2 py-1.5 pr-4 rounded-full transition-all cursor-pointer shadow-sm group select-none">
            {user ? (
               <>
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-extrabold text-sm shadow-inner group-hover:scale-105 transition-transform">
                    {user.initial}
                 </div>
                 <span className="text-sm font-bold opacity-90 group-hover:opacity-100 text-red-400">Logout</span>
               </>
            ) : (
               <span className="text-sm font-bold opacity-90 group-hover:opacity-100 text-primary-400 px-4 py-1.5 uppercase tracking-widest">Login</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
