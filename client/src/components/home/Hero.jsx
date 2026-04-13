import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Navigation, Tag, Heart } from 'lucide-react';

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80", // Goa
  "https://www.google.com/imgres?q=pondicherry&imgurl=https%3A%2F%2Fs7ap1.scene7.com%2Fis%2Fimage%2Fincredibleindia%2Fbasilica%2520of%2520the%2520sacred%2520heart%2520of%2520jesus%2520church-puducherry%3Fqlt%3D82%26ts%3D1726656309123&imgrefurl=https%3A%2F%2Fwww.incredibleindia.gov.in%2Fen%2Fpuducherry%2Fpuducherry&docid=iznE3n37FoUlmM&tbnid=qrwhHkd3V_GaJM&vet=12ahUKEwjRpOnKnM6TAxUSSmwGHRYgKr0QnPAOegQILRAB..i&w=1280&h=720&hcb=2&ved=2ahUKEwjRpOnKnM6TAxUSSmwGHRYgKr0QnPAOegQILRAB", // Ooty
  "https://www.google.com/imgres?q=pondicherry&imgurl=https%3A%2F%2Fblogger.googleusercontent.com%2Fimg%2Fb%2FR29vZ2xl%2FAVvXsEgAuW9r-9DgS8_XNHxcbwsf9tZ0fpGV0G38Z7jvKPH4IEVwpqWMEPB1xKu1K7yvdgKluRjbnLBhrYGQNC1dsM433Yajc7a69Y8vETYOpNZlzbuZyfwCqxor9a9ImiUgD_B2TIvSId5mvO04JcOed8MAMYkox4SbuRgs_RqBBY1pHhcYkppeb9cquWzvHa_k%2Fs2560%2FPondicherry%2520travel%2520vlog_02.jpg&imgrefurl=https%3A%2F%2Fwww.sid-thewanderer.com%2F2025%2F08%2Fi-explored-pondicherry-for-week-and.html&docid=lLcZ40F7RmWLSM&tbnid=lNFYoEJl6OZn8M&vet=12ahUKEwjRpOnKnM6TAxUSSmwGHRYgKr0QnPAOegQIGxAB..i&w=2560&h=1440&hcb=2&ved=2ahUKEwjRpOnKnM6TAxUSSmwGHRYgKr0QnPAOegQIGxAB"  // Pondicherry
];

const ESCAPES = [
  {
    name: "Goa",
    title: "Goa Beach Trip",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80",
    days: 3, budget: 5000, transport: "Train", rating: 4.8, tags: ["Beach", "Party"]
  },
  {
    name: "Pondicherry",
    title: "Pondicherry Heritage",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b1f74d6d?w=800&q=80",
    days: 2, budget: 2500, transport: "Bus", rating: 4.6, tags: ["Chill", "Culture"]
  },
  {
    name: "Ooty",
    title: "Ooty Hills Escape",
    image: "https://images.unsplash.com/photo-1605553648419-f00e0b4cf2f0?w=800&q=80",
    days: 4, budget: 6000, transport: "Bus", rating: 4.7, tags: ["Nature", "Hills"]
  }
];

const TESTIMONIALS = [
  { text: "Planned an epic Goa trip under ₹4000. The AI literally planned every single auto ride! 🔥", name: "Rahul S.", rating: 5, avatar: "R" },
  { text: "Saved so much time figuring out bus routes to Pondicherry. 10/10 recommend.", name: "Ananya M.", rating: 5, avatar: "A" },
  { text: "Best feature is the budget breakdown. Kept my friend group from overspending.", name: "Vikram K.", rating: 4.5, avatar: "V" }
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  // Handle rotating background initialization
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000); // changes every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Autofill form transition logic
  const handleQuickPlan = (escape) => {
    navigate('/planner', {
      state: {
        prefill: {
          destination: escape.name,
          budget: escape.budget,
          days: escape.days,
          preferences: escape.tags
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center -mt-16 overflow-x-hidden"
    >
      {/* 1. HERO SECTION */}
      <div className="relative w-full min-h-[100vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Dynamic Rotating Background */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={bgIndex}
            src={BACKGROUNDS[bgIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover z-0"
            alt="Beautiful travel destination"
          />
        </AnimatePresence>

        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 z-0"></div>

        {/* Floating animated travel icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 z-0 opacity-40 text-primary-500"
        >
          <Navigation size={64} fill="currentColor" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 z-0 opacity-40 text-secondary-500"
        >
          <MapPin size={56} fill="currentColor" />
        </motion.div>

        {/* Main Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col justify-center mt-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] drop-shadow-xl">
              Plan your next adventure,<br />
              {/* Gradient Shimmer Effect via animate-shimmer */}
              <span className="bg-gradient-to-r from-primary-400 via-secondary-300 to-primary-400 bg-clip-text text-transparent animate-shimmer">
                Smartly.
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The ultimate AI-powered trip planner built exclusively for VIT Chennai students. Tailored itineraries generated in seconds.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/planner"
              className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(157,78,221,0.4)] transition-all hover:scale-105"
            >
              Start Planning
            </Link>
            <a
              href="#popular"
              className="px-10 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full font-bold text-lg transition-all hover:scale-105"
            >
              Top Escapes
            </a>
          </motion.div>
        </div>
      </div>

      {/* 2. TOP ESCAPES CARDS */}
      <div id="popular" className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent pb-2">Student Favorites</h2>
          <p className="opacity-70 text-lg max-w-xl mx-auto font-medium">Curated weekend getaways highly rated by VITians. Click 'Quick Plan' to instantly generate a budget for these routes.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {ESCAPES.map((escape, idx) => (
            <motion.div
              key={escape.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:shadow-[0_0_40px_rgba(157,78,221,0.2)] transition-all duration-300"
            >
              {/* Image Zoom Hover effect */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 text-sm border border-white/10">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" /> {escape.rating}
                </div>
                <img
                  src={escape.image}
                  alt={escape.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              <div className="p-6 relative">
                <h3 className="text-2xl font-bold mb-3">{escape.title}</h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {escape.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold bg-white/10 text-primary-300 px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/5">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center opacity-80 text-sm font-medium mb-6">
                  <span className="flex items-center gap-1"><Navigation size={14} className="text-secondary-400" /> {escape.days} Days</span>
                  <span className="font-bold text-green-400">₹{escape.budget}</span>
                  <span>{escape.transport}</span>
                </div>

                {/* Quick Plan Autofill trigger */}
                <button
                  onClick={() => handleQuickPlan(escape)}
                  className="w-full py-3 bg-white/5 hover:bg-primary-500 border border-white/10 hover:border-transparent rounded-xl font-bold transition-all text-sm group-hover:shadow-lg"
                >
                  Quick Plan Trip
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. SOCIAL PROOF SECTION */}
      <div className="w-full bg-black/20 border-y border-white/10 py-24 mb-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-extrabold mb-4 flex items-center justify-center gap-3">
              <Heart className="text-primary-500 fill-primary-500" /> Loved by the Campus
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl relative hover:bg-white/10 transition-colors"
              >
                <Star size={24} className="absolute top-6 right-6 opacity-10 text-primary-500" />
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                  {[...Array(Math.floor(t.rating))].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="opacity-80 italic font-medium leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white shadow-md">
                    {t.avatar}
                  </div>
                  <span className="font-bold">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
