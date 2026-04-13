import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { Loader } from 'lucide-react';

export default function Dashboard() {
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setSavedTrips(data);
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 w-full mt-10 flex justify-center items-center h-64">
        <Loader className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full mt-10">
      <h2 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
        Your Saved Trips
      </h2>

      {savedTrips.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/20">
          <p className="text-xl opacity-70 mb-6 font-medium">You haven't saved any trips yet.</p>
          <Link to="/planner" className="px-8 py-4 bg-primary-500 hover:bg-primary-500/80 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-primary-500/30 inline-block">
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-inherit">
           {savedTrips.map((trip, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl hover:-translate-y-2 transition-transform cursor-pointer">
                 <h3 className="text-xl font-bold mb-2">{trip.title || trip.plan_data?.summary?.title}</h3>
                 <p className="opacity-70 text-sm font-semibold">Budget: ₹{trip.budget || trip.plan_data?.summary?.budgetEstimate}</p>
                 <button className="mt-4 text-primary-500 font-bold hover:text-secondary-500 transition-colors">View Itinerary →</button>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}
