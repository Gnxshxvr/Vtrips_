import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { supabase } from '../../supabase';
import { X, Mail, Lock, Loader, User } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setError(null);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase configuration is missing. Cannot authenticate.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        if (data.user) {
          const name = data.user.user_metadata?.full_name || email.split('@')[0];
          setUser({ name, initial: name.charAt(0).toUpperCase(), email });
          handleClose();
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          // Sometimes email confirmation is required depending on Supabase settings.
          // For now, let's just log them in if possible or notify them.
          const name = data.user.user_metadata?.full_name || email.split('@')[0];
          setUser({ name, initial: name.charAt(0).toUpperCase(), email });
          handleClose();
          alert("Account created successfully!");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 blur-[80px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/20 blur-[80px] pointer-events-none rounded-full"></div>

          <div className="p-8 relative z-10">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
               <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                 {isLogin ? "Welcome Back" : "Join VTRIPS"}
               </h2>
               <p className="text-sm text-white/60 mt-2 font-medium">
                 {isLogin ? "Sign in to access your curated student trips." : "Create an account to start planning your next adventure."}
               </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium p-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required={!isLogin}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors shadow-inner"
                  />
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-white/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors shadow-inner"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-white/40" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 transition-colors shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-extrabold rounded-xl py-3.5 shadow-[0_0_15px_rgba(157,78,221,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-white/60">
               {isLogin ? "Don't have an account? " : "Already have an account? "}
               <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-primary-400 hover:text-primary-300 font-bold transition-colors uppercase tracking-wide"
               >
                 {isLogin ? "Sign Up" : "Log In"}
               </button>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
