import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { MapPin, Wallet, Calendar, Compass, Users, Map, Hotel, Coffee, Sparkles } from 'lucide-react';

const DESTINATION_IMAGES = {
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
  ooty: "https://images.unsplash.com/photo-1605553648419-f00e0b4cf2f0?w=800&q=80",
  pondicherry: "https://images.unsplash.com/photo-1582510003544-4d00b1f74d6d?w=800&q=80",
  munnar: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b1f74d6d?w=800&q=80", // reusing for demo
  default: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
};

export default function TripForm() {
  const { isGenerating, setIsGenerating, setCurrentPlan } = useStore();
  const location = useLocation();

  const [formData, setFormData] = useState({
    source: 'VIT Chennai',
    destination: '',
    budget: 5000,
    days: 3,
    travelType: 'Friends',
    preferences: [],
    transportMode: 'Any',
    stayType: 'Budget',
    foodPreference: 'Any'
  });

  const [previewImage, setPreviewImage] = useState(DESTINATION_IMAGES.default);

  // Autofill logic from "Quick Plan"
  useEffect(() => {
    if (location.state?.prefill) {
      const { destination, budget, days, preferences } = location.state.prefill;
      setFormData(prev => ({
        ...prev,
        destination: destination || prev.destination,
        budget: budget || prev.budget,
        days: days || prev.days,
        preferences: preferences || prev.preferences
      }));
    }
  }, [location.state]);

  // Destination Image Banner logic
  useEffect(() => {
    if (formData.destination.length > 2) {
      const destLower = formData.destination.toLowerCase();
      // Find matching key
      const matchKey = Object.keys(DESTINATION_IMAGES).find(k => destLower.includes(k));
      setPreviewImage(matchKey ? DESTINATION_IMAGES[matchKey] : DESTINATION_IMAGES.default);
    } else {
      setPreviewImage(DESTINATION_IMAGES.default);
    }
  }, [formData.destination]);

  const preferenceOptions = ['Beach', 'Hill Station', 'Temple', 'Adventure', 'Nightlife', 'Historical'];

  const handlePreferenceToggle = (pref) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination) {
      alert("Please enter a destination!");
      return;
    }
    
    setIsGenerating(true);
    setCurrentPlan(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/generate-trip`, formData);
      setCurrentPlan(response.data);
    } catch (error) {
      console.error("Error generating trip:", error);
      const errorMsg = error.response?.data?.details || "Failed to generate trip. Please check your backend.";
      alert(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Smart Destination Preview Banner */}
      <motion.div 
        className="w-full h-40 rounded-3xl overflow-hidden relative shadow-lg group"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={previewImage}
            src={previewImage} 
            alt="Destination Preview" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h3 className="text-2xl font-extrabold capitalize drop-shadow-md">
            {formData.destination || "Where to next?"}
          </h3>
          <p className="opacity-80 text-sm font-medium flex items-center gap-1 drop-shadow-md">
            <MapPin size={14} /> From {formData.source}
          </p>
        </div>
      </motion.div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col gap-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        
        {/* Glow behind form */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Source & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="flex flex-col gap-2 relative group">
            <label className="text-xs font-bold opacity-70 uppercase tracking-widest text-primary-400">Departing From</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 text-inherit" />
               <input 
                 type="text" 
                 disabled 
                 value={formData.source} 
                 className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl focus:outline-none opacity-60 cursor-not-allowed font-medium text-inherit" 
               />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative group">
            <label className="text-xs font-bold opacity-70 uppercase tracking-widest text-secondary-400">Destination <span className="text-red-400">*</span></label>
            <div className="relative focus-within:ring-2 ring-secondary-500/50 rounded-xl transition-all">
               <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 text-secondary-500" />
               <input 
                 type="text" 
                 required
                 placeholder="e.g. Goa, Ooty..." 
                 value={formData.destination}
                 onChange={(e) => setFormData({...formData, destination: e.target.value})}
                 className="w-full bg-black/20 border border-white/10 p-3 pl-10 rounded-xl focus:outline-none focus:border-secondary-500 transition-colors font-bold text-inherit placeholder:opacity-40" 
               />
            </div>
          </div>
        </div>

        {/* Budget & Duration Sliders */}
        <div className="flex flex-col gap-6 relative z-10 mt-2">
          {/* Budget */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <label className="text-sm font-bold opacity-80 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary-500" /> Budget Limit
              </label>
              <span className="text-primary-400 font-extrabold text-lg">₹{formData.budget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" max="20000" step="500"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" 
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <label className="text-sm font-bold opacity-80 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary-500" /> Duration
              </label>
              <span className="text-secondary-400 font-extrabold text-lg">{formData.days} Days</span>
            </div>
            <input 
              type="range" 
              min="1" max="10" step="1"
              value={formData.days}
              onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>

        {/* Vibe Selection */}
        <div className="flex flex-col gap-3 relative z-10 border-t border-white/5 pt-6 mt-2">
           <label className="text-xs font-bold opacity-70 uppercase tracking-widest text-primary-400">Experience Vibe</label>
           <div className="flex flex-wrap gap-2">
              {preferenceOptions.map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handlePreferenceToggle(pref)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex-grow sm:flex-grow-0 text-center ${
                    formData.preferences.includes(pref) 
                      ? 'bg-gradient-to-tr from-primary-600 to-secondary-500 text-white shadow-[0_0_15px_rgba(157,78,221,0.4)] hover:scale-105' 
                      : 'bg-white/5 border border-white/10 opacity-70 hover:opacity-100 hover:bg-white/10'
                  }`}
                >
                  {pref}
                </button>
              ))}
           </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-2">
           <div className="flex flex-col gap-1.5 focus-within:text-primary-400 transition-colors">
              <label className="text-[11px] font-bold opacity-70 uppercase flex items-center gap-1"><Users size={12}/> Group</label>
              <select 
                value={formData.travelType}
                onChange={(e) => setFormData({...formData, travelType: e.target.value})}
                className="bg-black/20 border border-white/10 p-2.5 text-sm font-medium rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 ring-primary-500/50 [&>option]:text-black transition-all cursor-pointer"
              >
                <option>Solo</option>
                <option>Friends</option>
                <option>Couple</option>
              </select>
           </div>
           <div className="flex flex-col gap-1.5 focus-within:text-secondary-400 transition-colors">
              <label className="text-[11px] font-bold opacity-70 uppercase flex items-center gap-1"><Map size={12}/> Travel</label>
              <select 
                value={formData.transportMode}
                onChange={(e) => setFormData({...formData, transportMode: e.target.value})}
                className="bg-black/20 border border-white/10 p-2.5 text-sm font-medium rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-1 ring-secondary-500/50 [&>option]:text-black transition-all cursor-pointer"
              >
                <option>Any</option>
                <option>Train</option>
                <option>Bus</option>
                <option>Flight</option>
              </select>
           </div>
           <div className="flex flex-col gap-1.5 focus-within:text-primary-400 transition-colors">
              <label className="text-[11px] font-bold opacity-70 uppercase flex items-center gap-1"><Hotel size={12}/> Stay</label>
              <select 
                value={formData.stayType}
                onChange={(e) => setFormData({...formData, stayType: e.target.value})}
                className="bg-black/20 border border-white/10 p-2.5 text-sm font-medium rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 ring-primary-500/50 [&>option]:text-black transition-all cursor-pointer"
              >
                <option>Budget</option>
                <option>Mid-Range</option>
                <option>Luxury</option>
              </select>
           </div>
           <div className="flex flex-col gap-1.5 focus-within:text-secondary-400 transition-colors">
              <label className="text-[11px] font-bold opacity-70 uppercase flex items-center gap-1"><Coffee size={12}/> Food</label>
              <select 
                value={formData.foodPreference}
                onChange={(e) => setFormData({...formData, foodPreference: e.target.value})}
                className="bg-black/20 border border-white/10 p-2.5 text-sm font-medium rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-1 ring-secondary-500/50 [&>option]:text-black transition-all cursor-pointer"
              >
                <option>Any</option>
                <option>Veg</option>
                <option>Non-Veg</option>
              </select>
           </div>
        </div>

        {/* Sparkle Generate Button */}
        <button 
          type="submit"
          disabled={isGenerating}
          className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-extrabold text-lg shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:shadow-[0_0_30px_rgba(255,121,0,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-wait relative overflow-hidden group"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 h-full skew-x-12"></div>
          
          {isGenerating ? "Consulting AI..." : "Generate Magic Itinerary"}
          <Sparkles className={isGenerating ? "animate-spin" : "animate-pulse"} />
        </button>
      </form>
    </div>
  )
}
