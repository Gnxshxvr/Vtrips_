import { motion, AnimatePresence } from 'framer-motion';
import TripForm from './TripForm';
import TripResults from './TripResults';
import { useStore } from '../../store/useStore';
import { Lightbulb, Send, Map } from 'lucide-react';

export default function TripPlanner() {
  const { isGenerating, currentPlan } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12 w-full mt-4 flex-grow"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent pb-2 drop-shadow-sm">
          AI Trip Architect
        </h1>
        <p className="opacity-70 mt-3 text-lg max-w-2xl mx-auto font-medium">
          Tell us your budget, vibe, and duration. We'll instantly engineer a masterplan optimized for student budgets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 relative z-20">
           <TripForm />
        </div>
        
        <div className="lg:col-span-8 relative z-10">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center h-full min-h-[600px] bg-black/20 border border-white/5 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden shadow-2xl"
              >
                {/* Glowing Background pulse */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-secondary-500/5 animate-pulse"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(157,78,221,0.5)]"></div>
                   <h3 className="text-3xl font-extrabold animate-pulse bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-md pb-1">
                     Crunching Data...
                   </h3>
                   <p className="opacity-70 mt-3 max-w-md text-sm font-medium">Analyzing transport routes, budget constraints, and real-world student data to build your perfect timeline.</p>
                </div>

                {/* Skeleton UI elements */}
                <div className="w-full max-w-lg mt-14 space-y-5 opacity-50 relative z-10">
                   <div className="h-20 w-full bg-white/5 rounded-2xl animate-pulse"></div>
                   <div className="flex gap-4">
                     <div className="h-14 w-1/3 bg-white/5 rounded-2xl animate-pulse delay-75"></div>
                     <div className="h-14 w-2/3 bg-white/5 rounded-2xl animate-pulse delay-100"></div>
                   </div>
                   <div className="h-32 w-full bg-white/5 rounded-2xl animate-pulse delay-150"></div>
                </div>
              </motion.div>
            ) : currentPlan ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <TripResults plan={currentPlan} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full min-h-[600px] bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-xl backdrop-blur-sm"
              >
                <div className="flex-1 flex flex-col justify-center gap-10">
                   <div className="text-center">
                     <div className="inline-flex w-24 h-24 items-center justify-center bg-black/30 rounded-full text-4xl shadow-inner mb-6 ring-1 ring-white/10 hover:scale-110 transition-transform duration-500">
                       <Map className="text-primary-500 w-12 h-12" />
                     </div>
                     <h3 className="text-3xl font-bold opacity-90 mb-3 drop-shadow-sm text-white">Ready to explore?</h3>
                     <p className="opacity-60 text-sm max-w-md mx-auto font-medium leading-relaxed">Fill out the parameters to the left to unlock a premium, AI-curated journey complete with a vertical timeline and highly optimized budgeting.</p>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      {/* Tips */}
                      <div className="bg-black/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors hover:shadow-lg">
                         <h4 className="flex items-center gap-2 font-bold text-sm text-primary-400 mb-4 uppercase tracking-widest"><Lightbulb size={16}/> Pro Tips</h4>
                         <ul className="space-y-3 text-xs opacity-70 font-medium">
                           <li className="flex gap-2"><span className="text-primary-500">◆</span> Travel overnight to save hotel costs.</li>
                           <li className="flex gap-2"><span className="text-primary-500">◆</span> Book IRCTC tatkal tickets 24hrs prior.</li>
                           <li className="flex gap-2"><span className="text-primary-500">◆</span> Use Zostels for a student-friendly vibe.</li>
                         </ul>
                      </div>
                      <div className="bg-black/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors hover:shadow-lg">
                         <h4 className="flex items-center gap-2 font-bold text-sm text-secondary-400 mb-4 uppercase tracking-widest"><Send size={16}/> Popular Routes</h4>
                         <ul className="space-y-3 text-xs opacity-70 font-medium">
                           <li className="flex gap-2"><span className="text-secondary-500">◆</span> Chennai ➔ Pondicherry (3 hrs via ECR)</li>
                           <li className="flex gap-2"><span className="text-secondary-500">◆</span> Chennai ➔ Wayanad (Overnight bus)</li>
                           <li className="flex gap-2"><span className="text-secondary-500">◆</span> Chennai ➔ Goa (Train 17316)</li>
                         </ul>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
