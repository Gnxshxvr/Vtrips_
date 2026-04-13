import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadPDF, downloadJSON } from '../../utils/exportUtils';
import { Map as MapIcon, Wallet, List, Download, Save, FileText, CheckCircle, Loader, Coffee, Bed, Bus, MapPin, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { supabase } from '../../supabase';
import TripMap from './TripMap';

export default function TripResults({ plan }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedDays, setExpandedDays] = useState([]);

  if (!plan) return null;

  const handleDownloadPDF = () => {
    downloadPDF('trip-results-content', 'VTRIP_Plan.pdf');
  };

  const handleDownloadJSON = () => {
    downloadJSON(plan, 'VTRIP_Plan.json');
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSaveToDatabase = async () => {
    if (!supabase) {
      alert("Supabase is not configured properly!");
      return;
    }
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([
          {
            title: plan.summary?.title || "Custom Trip",
            budget: plan.summary?.budgetEstimate || 0,
            plan_data: plan
          }
        ]);
      
      if (error) {
        console.error("Error saving trip:", error);
        alert("Make sure you have created the 'trips' table in Supabase! See Walkthrough for SQL.");
      } else {
        alert("Trip saved successfully to Supabase!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving trip.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  // Helper function to pick icon based on description context
  const getActivityIcon = (desc) => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('hotel') || lowerDesc.includes('stay') || lowerDesc.includes('check-in')) return <Bed size={16} className="text-secondary-400" />;
    if (lowerDesc.includes('food') || lowerDesc.includes('breakfast') || lowerDesc.includes('lunch') || lowerDesc.includes('dinner') || lowerDesc.includes('eat')) return <Coffee size={16} className="text-orange-400" />;
    if (lowerDesc.includes('bus') || lowerDesc.includes('train') || lowerDesc.includes('travel') || lowerDesc.includes('flight') || lowerDesc.includes('auto')) return <Bus size={16} className="text-blue-400" />;
    return <MapPin size={16} className="text-primary-400" />;
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full text-inherit">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold pb-1 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent drop-shadow-sm">
            {plan.summary?.title || "Your Custom AI Itinerary"}
          </h2>
        </div>
        
        <div className="flex gap-3">
           <button onClick={handleDownloadPDF} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
              <Download size={16} /> PDF
           </button>
           <button onClick={handleDownloadJSON} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
              <FileText size={16} /> JSON
           </button>
           <button 
             onClick={handleSaveToDatabase}
             disabled={isSaving}
             className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl text-white flex items-center gap-2 text-sm font-extrabold transition-all shadow-[0_0_15px_rgba(157,78,221,0.4)] disabled:opacity-50"
           >
              {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />} 
              {isSaving ? "Saving..." : "Save Trip"}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-black/20 border border-white/10 rounded-2xl p-1.5 overflow-x-auto text-inherit shadow-inner">
        {[
          { id: 'summary', icon: <List size={18}/>, label: 'Summary' },
          { id: 'detailed', icon: <Navigation size={18}/>, label: 'Detailed Timeline' },
          { id: 'budget', icon: <Wallet size={18}/>, label: 'Budget Breakdown' },
          { id: 'map', icon: <MapIcon size={18}/>, label: 'Map View' },
          ...(plan.trainDetails && plan.trainDetails.length > 0 ? [{ id: 'trains', icon: <Bus size={18}/>, label: 'Train Services' }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white/10 text-white shadow-md border-b-2 border-primary-500' : 'hover:bg-white/5 opacity-60 hover:opacity-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div id="trip-results-content" className="bg-black/20 backdrop-blur-md flex-1 rounded-3xl border border-white/10 p-6 md:p-10 min-h-[400px] shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8 text-inherit relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-inherit">
                 {/* Est Budget */}
                 <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-lg group">
                    <Wallet size={40} className="text-secondary-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm opacity-70 uppercase tracking-widest font-extrabold">Total Student Budget</p>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500 mt-2">₹{plan.summary?.budgetEstimate?.toLocaleString()}</p>
                 </div>
                 {/* Highlights */}
                 <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
                    <p className="text-sm opacity-70 uppercase tracking-widest font-extrabold mb-4">Key Highlights</p>
                    <ul className="flex flex-col gap-4">
                       {plan.summary?.highlights?.map((h, i) => (
                         <li key={i} className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                            <span className="text-sm font-bold opacity-90">{h}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-lg">
                  <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2 tracking-wide text-primary-400">
                     <Bus size={18} /> Travel Advice
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed font-medium">{plan.travelSuggestions}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-lg">
                  <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2 tracking-wide text-secondary-400">
                     <Bed size={18} /> Stay Ideas
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed font-medium">{plan.staySuggestions}</p>
                </div>
              </div>

              {plan.studentTips && (
                <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 p-6 rounded-3xl shadow-lg mt-2">
                   <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2 drop-shadow-sm text-yellow-400">
                      💡 VIT Student Hacks
                   </h3>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-90 text-sm font-bold">
                      {plan.studentTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                           <span className="text-secondary-400 text-lg leading-none">⚡</span> {tip}
                        </li>
                      ))}
                   </ul>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'detailed' && (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6 text-inherit relative z-10"
            >
               <div className="relative pt-4">
                 {/* Main Timeline Line */}
                 <div className="absolute left-6 top-8 bottom-0 w-1 bg-gradient-to-b from-primary-500/50 via-secondary-500/50 to-transparent rounded-full hidden md:block"></div>

                 <div className="space-y-6">
                   {plan.detailedItinerary?.map((day, dIdx) => {
                     const isExpanded = expandedDays.includes(dIdx);
                     return (
                       <div key={dIdx} className="relative z-10 md:pl-16">
                          {/* Day Header */}
                          <div 
                             onClick={() => toggleDayExpansion(dIdx)}
                             className="bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all shadow-md group relative overflow-hidden"
                          >
                             {/* Floating day orb indicator */}
                             <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(157,78,221,0.8)] hidden md:block"></div>

                             <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 drop-shadow-sm">Day {day.day}</h3>
                                <div className="h-1.5 w-1.5 bg-white/30 rounded-full hidden md:block"></div>
                                <h4 className="text-lg opacity-90 font-bold">{day.theme}</h4>
                             </div>
                             
                             <div className="bg-black/30 p-2 rounded-full border border-white/10 group-hover:bg-primary-500 transition-colors">
                                {isExpanded ? <ChevronUp size={20} className="text-white"/> : <ChevronDown size={20} className="text-white"/>}
                             </div>
                          </div>

                          {/* Expanded Activities */}
                          <AnimatePresence>
                             {isExpanded && (
                               <motion.div 
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <div className="flex flex-col gap-4 mt-6 md:pl-4">
                                    {day.activities?.map((act, aIdx) => (
                                       <div key={aIdx} className="bg-black/30 border border-white/5 p-5 rounded-2xl transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-lg relative flex gap-4">
                                          {/* Icon Column */}
                                          <div className="mt-1 flex-shrink-0 bg-white/5 p-3 rounded-xl border border-white/10 h-min">
                                             {getActivityIcon(act.description)}
                                          </div>
                                          
                                          {/* Details Column */}
                                          <div className="flex-1">
                                             <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                <span className="font-extrabold text-xs uppercase tracking-widest bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/5">
                                                   {act.time}
                                                </span>
                                                {act.costEst > 0 && 
                                                   <motion.span 
                                                      whileHover={{ scale: 1.05 }}
                                                      className="text-sm font-black bg-gradient-to-r from-secondary-500 to-orange-500 px-4 py-1.5 rounded-full shadow-md drop-shadow-sm flex items-center gap-1"
                                                   >
                                                      ₹{act.costEst}
                                                   </motion.span>
                                                }
                                             </div>
                                             <p className="text-sm md:text-base font-medium opacity-90 leading-relaxed mt-3">{act.description}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                               </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                     );
                   })}
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="text-inherit relative z-10"
            >
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl max-w-2xl mx-auto">
                  <h3 className="text-3xl font-black mb-10 text-center bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent drop-shadow-sm">Estimated Expense Allocation</h3>
                  
                  <div className="space-y-8">
                     {[
                       { label: 'Transport', key: 'transport', color: 'bg-blue-500', icon: <Bus size={18}/> },
                       { label: 'Stay', key: 'stay', color: 'bg-indigo-500', icon: <Bed size={18}/> },
                       { label: 'Food & Drink', key: 'food', color: 'bg-orange-500', icon: <Coffee size={18}/> },
                       { label: 'Activities', key: 'activities', color: 'bg-pink-500', icon: <MapPin size={18}/> },
                       { label: 'Miscellaneous', key: 'miscellaneous', color: 'bg-green-500', icon: <Wallet size={18}/> }
                     ].map(category => (
                        <div key={category.key} className="flex flex-col gap-3 group">
                           <div className="flex justify-between items-center text-sm md:text-base font-bold opacity-90">
                              <span className="flex items-center gap-2">
                                 <span className={`p-1.5 rounded-lg ${category.color.replace('bg-', 'bg-').concat('/20')} ${category.color.replace('bg-', 'text-')}`}>
                                   {category.icon}
                                 </span>
                                 {category.label}
                              </span>
                              <span className="text-lg font-black tracking-wide">₹{plan.budgetBreakdown?.[category.key]?.toLocaleString() || 0}</span>
                           </div>
                           <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, Math.max(2, ((plan.budgetBreakdown?.[category.key] || 0) / (plan.summary?.budgetEstimate || 1)) * 100))}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full ${category.color} rounded-full relative overflow-hidden`} 
                              >
                                 <div className="absolute inset-0 bg-white/20 w-1/2 skew-x-12 animate-shimmer"></div>
                              </motion.div>
                           </div>
                        </div>
                     ))}
                     
                     <div className="mt-10 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white/5 to-transparent p-6 rounded-2xl">
                        <span className="font-extrabold text-xl uppercase tracking-widest opacity-80">Total Splurge</span>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500"
                        >
                           ₹{plan.summary?.budgetEstimate?.toLocaleString()}
                        </motion.span>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="text-inherit relative z-10 w-full h-full"
            >
               <TripMap destinationName={plan.summary?.destinationCity || plan.summary?.title} />
            </motion.div>
          )}

          {activeTab === 'trains' && (
            <motion.div
              key="trains"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-inherit relative z-10 w-full h-full flex flex-col gap-6"
            >
              <h3 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2">
                 <Bus size={28} className="text-blue-500" /> Transit Connections
              </h3>
              <p className="text-sm font-bold opacity-70 mb-4">Live fetched train schedule for your destination query.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {plan.trainDetails?.map((train, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-lg hover:border-white/20 transition-all hover:-translate-y-1 group">
                       <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xl font-bold">{train.trainName}</h4>
                          <span className="bg-blue-500/20 text-blue-300 font-bold px-3 py-1 rounded-full text-sm">#{train.trainNumber}</span>
                       </div>
                       <div className="flex justify-between items-center opacity-80 mt-4">
                          <div className="flex flex-col">
                             <span className="text-xs uppercase tracking-wider font-bold text-primary-400 mb-1">Departs</span>
                             <span className="text-xl font-black text-white drop-shadow-md">{train.departureTime}</span>
                             <span className="text-xs font-semibold">{train.origin}</span>
                          </div>
                          <div className="flex flex-col items-center flex-1 mx-4">
                             <span className="text-[10px] uppercase font-black opacity-70 bg-black/40 px-2 py-0.5 rounded-sm">{train.duration}</span>
                             <div className="w-full h-px bg-white/20 relative my-2">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500"></div>
                             </div>
                          </div>
                          <div className="flex flex-col text-right">
                             <span className="text-xs uppercase tracking-wider font-bold text-secondary-400 mb-1">Arrives</span>
                             <span className="text-xl font-black text-white drop-shadow-md">{train.arrivalTime}</span>
                             <span className="text-xs font-semibold">{train.destination}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
