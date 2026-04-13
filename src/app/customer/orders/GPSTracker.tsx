"use client";

import { useState, useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";

type TrackingProps = {
  orderId: string;
  onClose: () => void;
};

export default function GPSTracker({ orderId, onClose }: TrackingProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Dispatching from KOO Farm...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatus("Arrived at your location!");
          return 100;
        }
        
        if (prev > 80) setStatus("Approaching delivery address...");
        else if (prev > 40) setStatus("In transit - On B2B Route #42");
        else if (prev > 10) setStatus("Leaving Processing Facility...");
        
        return prev + 1;
      });
    }, 100); // 10 seconds total for demo

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-none">
      <div className="w-full max-w-md bg-white border-8 border-gray-900 p-8 space-y-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <CloseIcon fontSize="medium" />
        </button>

        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 animate-pulse border-2 border-emerald-200"></span>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">GPS Tracking</h2>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order #{orderId.slice(0, 8)}</p>
        </div>

        {/* Map Mockup */}
        <div className="relative h-48 bg-gray-100 border-4 border-gray-900 overflow-hidden">
           {/* Grid pattern */}
           <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #9CA3AF 2px, transparent 2px)',
              backgroundSize: '24px 24px'
           }}></div>

           {/* Route path */}
           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M10,80 Q30,20 50,50 T90,20" 
                fill="none" 
                stroke="#D1D5DB" 
                strokeWidth="4" 
                strokeDasharray="4 4" 
              />
              <path 
                d="M10,80 Q30,20 50,50 T90,20" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="4" 
                strokeDasharray="200"
                strokeDashoffset={200 - (progress / 100) * 200}
                className="transition-all duration-300 ease-out"
              />
           </svg>

           {/* Start Point */}
           <div className="absolute left-[8%] bottom-[15%] flex flex-col items-center">
              <div className="w-4 h-4 bg-gray-900 border-2 border-white"></div>
              <span className="text-[8px] text-gray-900 mt-1 font-black uppercase tracking-widest bg-white px-1">KOO FARM</span>
           </div>

           {/* End Point */}
           <div className="absolute right-[8%] top-[15%] flex flex-col items-center">
              <div className="w-5 h-5 bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                 <LocationOnIcon style={{ fontSize: 12 }} />
              </div>
              <span className="text-[8px] text-emerald-700 mt-1 font-black uppercase tracking-widest bg-emerald-50 px-1">YOU</span>
           </div>

           {/* Vehicle */}
           <div 
             className="absolute transition-all duration-300 ease-out"
             style={{
               left: `${10 + (progress / 100) * 80}%`,
               top: `${80 - (progress / 100) * 60}%`, // Simplified linear for demo
               transform: 'translate(-50%, -50%)'
             }}
           >
              <div className="w-10 h-10 bg-white border-4 border-gray-900 flex items-center justify-center text-gray-900 transform -translate-y-1/2">
                 <LocalShippingIcon fontSize="small" />
              </div>
           </div>
        </div>

        {/* Progress & Status */}
        <div className="space-y-6">
           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                 <p className="text-sm font-black text-gray-900 uppercase leading-tight">{status}</p>
              </div>
              <p className="text-3xl font-black text-blue-500 tabular-nums">{progress}%</p>
           </div>
           
           <div className="h-3 w-full bg-gray-200 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
           </div>

           <div className="flex gap-4 pt-4 border-t-4 border-gray-100">
              <div className="flex-1 p-4 bg-gray-50 border-2 border-gray-200">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">ETA</p>
                 <p className="text-lg font-black text-gray-900">{Math.max(0, 15 - Math.floor(progress / 7))} MIN</p>
              </div>
              <div className="flex-1 p-4 bg-emerald-50 border-2 border-emerald-200">
                 <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Temp</p>
                 <div className="flex items-baseline gap-2">
                    <p className="text-lg font-black text-emerald-600">4.2°C</p>
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">OK</span>
                 </div>
              </div>
           </div>
        </div>

        {progress === 100 && (
          <button 
            onClick={onClose}
            className="w-full py-5 bg-emerald-500 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-colors mt-4"
          >
            Acknowledge Arrival
          </button>
        )}
      </div>
    </div>
  );
}
