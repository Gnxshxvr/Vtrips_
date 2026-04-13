import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import { Loader, MapPin } from 'lucide-react';

// Custom Map Updater Component to change view when coordinates change
function CenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
}

export default function TripMap({ destinationName }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fallback for missing name
        const query = destinationName || 'India';
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.length > 0) {
          setCoordinates([parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]);
        } else {
          // Default to central India if not found
          setCoordinates([20.5937, 78.9629]);
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        // Default to central India if not found
        setCoordinates([20.5937, 78.9629]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [destinationName]);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-white/10 shadow-inner">
         <Loader size={32} className="animate-spin text-primary-500 mb-4" />
         <span className="font-bold opacity-70">Locating {destinationName}...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
       <MapContainer 
         center={coordinates || [20.5937, 78.9629]} 
         zoom={12} 
         className="w-full h-[500px] z-10"
         zoomControl={false}
       >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <CenterUpdater center={coordinates} />
          {coordinates && (
             <Marker position={coordinates}>
               <Popup>
                 <div className="font-bold text-center">
                    {destinationName}
                 </div>
               </Popup>
             </Marker>
          )}
       </MapContainer>

       {/* Decorative Overlay */}
       <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-black text-sm flex items-center gap-2 shadow-lg drop-shadow-sm text-white">
          <MapPin size={16} className="text-secondary-400" />
          {destinationName || "Destination Map"}
       </div>
    </div>
  );
}
