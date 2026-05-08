import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Activity, Clock, ShieldAlert, Ban, Info, Moon, Sun } from 'lucide-react';

interface KeyEvent {
  id: string;
  key: string;
  timestamp: string;
  rawCode: string;
}

export default function Visualizer() {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDemoRunning) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab' || e.key === 'Alt') e.preventDefault();

        const newEvent: KeyEvent = {
          id: Math.random().toString(36).substr(2, 9),
          key: e.key === ' ' ? 'Space' : e.key,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + new Date().getMilliseconds().toString()[0],
          rawCode: e.code
        };

        setEvents(prev => [...prev.slice(-19), newEvent]); // Keep last 20 for the sleek list
        setTotalCount(prev => prev + 1);
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDemoRunning]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const toggleDemo = () => {
    if (!isDemoRunning) {
      setEvents([]);
      setTotalCount(0);
    }
    setIsDemoRunning(!isDemoRunning);
  };

  const getSessionTime = () => {
    const diff = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
    const mins = Math.floor(diff / 60).toString().padStart(2, '0');
    const secs = (diff % 60).toString().padStart(2, '0');
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden">
      {/* Educational Banner */}
      <div className="bg-red-700 bg-opacity-90 text-white text-center py-2 text-xs font-bold tracking-[0.2em] uppercase shadow-lg z-50">
        Educational Keyboard Event Demo Only
      </div>

      {/* Main App Window Chrome */}
      <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
        
        {/* Header Section */}
        <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Keyboard Event <span className="text-blue-500">Visualizer</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-medium">
              Local Development Environment • V1.1.0 • {isDemoRunning ? 'RECORDING' : 'IDLE'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsDemoRunning(true)}
              disabled={isDemoRunning}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${
                isDemoRunning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(5,150,105,0.3)]'
              }`}
            >
              {!isDemoRunning && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
              START DEMO
            </button>
            <button 
              onClick={() => setIsDemoRunning(false)}
              disabled={!isDemoRunning}
              className={`px-6 py-3 rounded-xl font-bold border transition-all ${
                !isDemoRunning
                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              STOP DEMO
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* Left Column: Live Visualizer */}
          <div className="col-span-7 flex flex-col space-y-6">
            {/* Current Key Hero */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-6 left-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isDemoRunning ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`} />
                Active Input Detection
              </div>
              
              <AnimatePresence mode="wait">
                {isDemoRunning ? (
                  <motion.div
                    key={events[events.length - 1]?.key || 'waiting'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-[140px] font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] leading-none">
                      {events[events.length - 1]?.key || '_'}
                    </div>
                    <div className="text-xl font-medium text-blue-400 mt-4 uppercase tracking-tighter">
                      {events[events.length - 1]?.key ? `KEY_${events[events.length - 1].key.toUpperCase()} (CODE: ${events[events.length - 1].rawCode})` : 'Awaiting Input'}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center opacity-20">
                    <Keyboard size={80} className="mb-4" />
                    <div className="text-xl font-bold uppercase tracking-widest">System Standby</div>
                  </div>
                )}
              </AnimatePresence>
              
              {/* Decorative corners */}
              <div className="absolute bottom-6 right-6 flex flex-col items-end opacity-20 font-mono text-[8px] uppercase">
                <span>Buffer_Status: Nominal</span>
                <span>Latency: {Math.floor(Math.random() * 5) + 1}ms</span>
              </div>
            </div>

            {/* Event Info Bar */}
            <div className="h-24 grid grid-cols-3 gap-4">
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Key Count</span>
                <span className="text-2xl font-mono text-white">{totalCount.toString().padStart(6, '0')}</span>
              </div>
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Last Timestamp</span>
                <span className="text-2xl font-mono text-white">{events[events.length - 1]?.timestamp || '--:--:--.-'}</span>
              </div>
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Current Session</span>
                <span className="text-2xl font-mono text-emerald-500">{isDemoRunning ? getSessionTime() : '00m 00s'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Event Log */}
          <div className="col-span-5 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Event Log</span>
              <span className={`px-2 py-1 text-[10px] rounded border ${isDemoRunning ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-600 border-slate-700'}`}>
                {isDemoRunning ? 'LISTENING...' : 'PAUSED'}
              </span>
            </div>
            
            <div className="flex-1 p-4 font-mono text-[11px] space-y-2 overflow-y-auto">
              {!isDemoRunning && events.length === 0 && (
                <>
                  <div className="text-slate-500 opacity-60 italic">[00:00:00.0] system.init: Keyboard listener ready</div>
                  <div className="text-slate-500 opacity-60 italic">_ awaiting telemetry start...</div>
                </>
              )}
              
              {events.map((ev, idx) => (
                <motion.div 
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={ev.id}
                  className={`flex justify-between items-center p-2 rounded ${idx === events.length - 1 ? 'bg-blue-500/20 border-l-2 border-blue-500' : 'bg-slate-800/50'}`}
                >
                  <span className={idx === events.length - 1 ? 'text-white font-bold' : 'text-emerald-400'}>
                    PRESSED: '{ev.key}'
                  </span>
                  <span className="text-slate-500 text-[10px]">{ev.timestamp}</span>
                </motion.div>
              ))}
              <div ref={logEndRef} />
              
              {isDemoRunning && (
                <div className="animate-pulse text-slate-600 pl-2">_ awaiting user input...</div>
              )}
            </div>

            {/* Ethical Footer Area */}
            <div className="p-4 bg-slate-950/50 border-t border-slate-800">
              <div className="text-[9px] text-slate-500 leading-tight">
                <strong className="text-slate-400 uppercase mr-1">Ethical Notice:</strong> 
                This application utilizes local DOM event listeners. It is restricted from background capture, network transmission, or persistent disk storage. Local session use only.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 text-[10px] font-medium text-slate-500 uppercase tracking-widest shrink-0">
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-2">
            Status: <span className={isDemoRunning ? "text-emerald-500" : "text-amber-500"}>{isDemoRunning ? "Capturing" : "Ready"}</span>
          </span>
          <span className="flex items-center gap-2">
            Protocol: <span className="text-slate-300">Local_Link</span>
          </span>
        </div>
        <div className="flex space-x-6">
          <span className="flex items-center gap-2">
            Security: <span className="text-emerald-500">Encapsulated</span>
          </span>
          <span className="flex items-center gap-2 text-blue-400">
            Secure Environment Verified
          </span>
        </div>
      </div>
    </div>
  );
}

