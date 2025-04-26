import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  time: number;
  title: string;
}

interface VideoProgressProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  color?: "purple" | "blue" | "red" | "green" | "gradient";
  waveform?: boolean;
  chapters?: Chapter[];
}

type ColorScheme = {
  base: string;
  accent: string;
  thumb: string;
  glow: string;
};

type ColorSchemes = {
  purple: ColorScheme;
  blue: ColorScheme;
  red: ColorScheme;
  green: ColorScheme;
  gradient: ColorScheme;
};

const VideoProgress = ({ 
  currentTime, 
  duration, 
  buffered, 
  onSeek,
  color = "gradient",
  waveform = true,
  chapters = []
}: VideoProgressProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isKeyboardScrubbing, setIsKeyboardScrubbing] = useState(false);
  const [keyboardStep, setKeyboardStep] = useState(5); // Seconds to skip
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [showWaveform, setShowWaveform] = useState(waveform);
  
  // Generated waveform data (simulated for demo)
  const waveformData = useMemo(() => {
    // In a real implementation, this would be loaded from audio analysis data
    const data = [];
    const bars = 100;
    for (let i = 0; i < bars; i++) {
      // Create a pseudo-random but deterministic pattern
      const height = 0.2 + Math.sin(i * 0.2) * 0.2 + Math.cos(i * 0.3) * 0.2 + Math.abs(Math.sin(i * 0.5)) * 0.4;
      data.push(Math.max(0.15, Math.min(1, height)));
    }
    return data;
  }, []);
  
  // Define color schemes
  const colorSchemes: ColorSchemes = {
    purple: {
      base: "bg-purple-900/40",
      accent: "bg-purple-500",
      thumb: "bg-purple-400",
      glow: "rgba(168, 85, 247, 0.4)"
    },
    blue: {
      base: "bg-blue-900/40",
      accent: "bg-blue-500",
      thumb: "bg-blue-400",
      glow: "rgba(59, 130, 246, 0.4)"
    },
    red: {
      base: "bg-red-900/40",
      accent: "bg-red-500",
      thumb: "bg-red-400",
      glow: "rgba(239, 68, 68, 0.4)"
    },
    green: {
      base: "bg-green-900/40",
      accent: "bg-green-500",
      thumb: "bg-green-400",
      glow: "rgba(34, 197, 94, 0.4)"
    },
    gradient: {
      base: "bg-zinc-800/60",
      accent: "bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500",
      thumb: "bg-white",
      glow: "rgba(255, 255, 255, 0.3)"
    }
  };
  
  // Get the appropriate color scheme
  const colorClasses = colorSchemes[color] || colorSchemes.gradient;
  
  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }, []);
  
  // Percentage calculations
  const getBufferedPercent = useMemo(() => {
    if (!duration || duration <= 0 || isNaN(duration)) return 0;
    const percent = (buffered / duration) * 100;
    return isNaN(percent) ? 0 : Math.min(100, Math.max(0, percent));
  }, [buffered, duration]);
  
  const getCurrentPercent = useMemo(() => {
    if (!duration || duration <= 0 || isNaN(duration)) return 0;
    const percent = (currentTime / duration) * 100;
    return isNaN(percent) ? 0 : Math.min(100, Math.max(0, percent)); 
  }, [currentTime, duration]);

  // Handle position calculations
  const calculatePosition = useCallback((clientX: number) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return position;
    }
    return null;
  }, []);

  // Handle seeking logic - only called on click or during drag
  const handleSeek = useCallback((clientX: number) => {
    if (progressRef.current && duration > 0) {
      const position = calculatePosition(clientX);
      if (position !== null) {
        onSeek(position * duration);
      }
    }
  }, [calculatePosition, duration, onSeek]);

  // Define global event handlers first (to avoid reference-before-declaration errors)
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && progressRef.current && duration > 0) {
      const position = calculatePosition(e.clientX);
      if (position !== null) {
        setHoverPosition(position * 100);
        setHoverTime(position * duration);
        onSeek(position * duration);
      }
    }
  }, [calculatePosition, duration, isDragging, onSeek]);
  
  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleGlobalMouseMove]);
  
  const handleGlobalTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && progressRef.current && duration > 0 && e.touches.length) {
      const position = calculatePosition(e.touches[0].clientX);
      if (position !== null) {
        setHoverPosition(position * 100);
        setHoverTime(position * duration);
        onSeek(position * duration);
      }
    }
  }, [calculatePosition, duration, isDragging, onSeek]);
  
  const handleGlobalTouchEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleGlobalTouchMove);
    document.removeEventListener('touchend', handleGlobalTouchEnd);
    document.removeEventListener('touchcancel', handleGlobalTouchEnd);
  }, [handleGlobalTouchMove]);

  // Handle click to seek (different from dragging)
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger click after dragging
    if (!isDragging) {
      handleSeek(e.clientX);
    }
  }, [isDragging, handleSeek]);
  
  // Mouse event handlers - only update hover position, NEVER seek on hover
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Only update hover position indicator, never seek
    const position = calculatePosition(e.clientX);
    if (position !== null) {
      setHoverPosition(position * 100);
      setHoverTime(position * duration);
      
      // We only seek during an active drag, not on hover
      // This is handled by the global mouse move handler
    }
  }, [calculatePosition, duration]);

  // Handle touch move events similarly
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length) {
      const position = calculatePosition(e.touches[0].clientX);
      if (position !== null) {
        setHoverPosition(position * 100);
        setHoverTime(position * duration);
        
        // Touch moves only seek when dragging
        if (isDragging) {
          e.preventDefault(); // Prevent scrolling while dragging
          // The actual seeking is handled by the global touch move handler
        }
      }
    }
  }, [calculatePosition, duration, isDragging]);

  // Initiate dragging on mouse down and do the initial seek
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX); // Initial seek on mouse down
    
    // Add global event listeners for dragging
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  }, [handleSeek, handleGlobalMouseMove, handleGlobalMouseUp]);
  
  // Initiate dragging on touch start and do the initial seek
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length) {
      setIsDragging(true);
      handleSeek(e.touches[0].clientX); // Initial seek on touch
      
      // Prevent scrolling while dragging
      e.preventDefault();
      
      // Add global event listeners for dragging
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
      document.addEventListener('touchcancel', handleGlobalTouchEnd);
    }
  }, [handleSeek, handleGlobalTouchMove, handleGlobalTouchEnd]);
  
  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setHoverPosition(null);
      setHoverTime(null);
    }
  }, [isDragging]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle keyboard shortcuts when the player is in focus
    if (progressRef.current?.contains(document.activeElement)) {
      const step = e.shiftKey ? 10 : 5; // Larger step with shift
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          onSeek(Math.min(duration, currentTime + step));
          setIsKeyboardScrubbing(true);
          setKeyboardStep(step);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSeek(Math.max(0, currentTime - step));
          setIsKeyboardScrubbing(true);
          setKeyboardStep(-step);
          break;
        case 'Home':
          e.preventDefault();
          onSeek(0);
          break;
        case 'End':
          e.preventDefault();
          onSeek(duration);
          break;
      }
    }
  }, [currentTime, duration, onSeek]);
  
  // Reset keyboard scrubbing state
  useEffect(() => {
    if (isKeyboardScrubbing) {
      const timer = setTimeout(() => {
        setIsKeyboardScrubbing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTime, isKeyboardScrubbing]);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchEnd);
    };
  }, [handleKeyDown, handleGlobalMouseMove, handleGlobalMouseUp, handleGlobalTouchMove, handleGlobalTouchEnd]);

  // Draw waveform visualization on canvas
  useEffect(() => {
    if (waveformRef.current && showWaveform) {
      const canvas = waveformRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate played percentage
      const playedPercent = getCurrentPercent / 100;
      
      // Draw waveform bars
      const barWidth = canvas.offsetWidth / waveformData.length;
      const barMargin = 1;
      const maxBarHeight = canvas.offsetHeight * 0.8;
      
      waveformData.forEach((amplitude, index) => {
        const x = index * barWidth;
        const barHeight = amplitude * maxBarHeight;
        const y = (canvas.offsetHeight - barHeight) / 2;
        
        // Determine if this bar has been played
        const isPlayed = (x / canvas.offsetWidth) < playedPercent;
        
        // Set gradient colors
        ctx.fillStyle = isPlayed ? 
          'rgba(168, 85, 247, 0.9)' : 
          'rgba(168, 85, 247, 0.2)';
          
        // Draw bar with rounded corners
        ctx.beginPath();
        const radius = Math.min(barWidth / 2 - barMargin, barHeight / 2);
        
        // Draw rounded rectangle
        ctx.moveTo(x + barMargin + radius, y);
        ctx.lineTo(x + barWidth - barMargin - radius, y);
        ctx.quadraticCurveTo(x + barWidth - barMargin, y, x + barWidth - barMargin, y + radius);
        ctx.lineTo(x + barWidth - barMargin, y + barHeight - radius);
        ctx.quadraticCurveTo(x + barWidth - barMargin, y + barHeight, x + barWidth - barMargin - radius, y + barHeight);
        ctx.lineTo(x + barMargin + radius, y + barHeight);
        ctx.quadraticCurveTo(x + barMargin, y + barHeight, x + barMargin, y + barHeight - radius);
        ctx.lineTo(x + barMargin, y + radius);
        ctx.quadraticCurveTo(x + barMargin, y, x + barMargin + radius, y);
        ctx.closePath();
        
        ctx.fill();
      });
    }
  }, [getCurrentPercent, showWaveform, waveformData]);

  // Toggle waveform visualization
  const toggleWaveform = useCallback(() => {
    setShowWaveform(!showWaveform);
  }, [showWaveform]);

  return (
    <div className="w-full mb-2 select-none relative">
      <style jsx>{`
        .progress-container {
          transition: transform 0.3s ease;
        }
        
        .progress-container:hover {
          transform: scaleY(1.2);
        }
        
        .progress-bar {
          height: ${showWaveform ? '30px' : '4px'};
          transition: height 0.3s ease, transform 0.2s ease;
        }
        
        .progress-thumb {
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                      box-shadow 0.2s ease;
          box-shadow: 0 0 0 0 ${colorClasses.glow};
        }
        
        .progress-container:hover .progress-thumb {
          transform: scale(1.3);
        }
        
        .progress-thumb.active {
          transform: scale(1.5) !important;
          box-shadow: 0 0 0 8px ${colorClasses.glow};
        }
        
        .chapter-marker {
          position: absolute;
          height: 100%;
          width: 2px;
          background-color: rgba(255, 255, 255, 0.5);
          z-index: 2;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        
        .chapter-marker:hover {
          transform: scaleX(2);
          background-color: rgba(255, 255, 255, 0.8);
        }
        
        .keyboard-indicator {
          position: absolute;
          bottom: 100%;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 10;
          white-space: nowrap;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        .keyboard-indicator-arrow {
          animation: pulse 1s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      {/* Keyboard scrubbing indicator */}
      <AnimatePresence>
        {isKeyboardScrubbing && (
          <motion.div 
            className="keyboard-indicator"
            style={{ left: `${getCurrentPercent}%` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <span className="keyboard-indicator-arrow">
              {keyboardStep > 0 ? '→' : '←'}
            </span>
            {' '}
            {Math.abs(keyboardStep)}s
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating time display */}
      <AnimatePresence>
        {(hoverPosition !== null && hoverTime !== null) || isDragging ? (
          <motion.div 
            className="absolute bottom-full mb-3 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border border-white/10 flex items-center gap-2 transform -translate-x-1/2 z-20"
            style={{ 
              left: `${hoverPosition !== null ? hoverPosition : getCurrentPercent}%`
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <span className="text-white/60">
              {formatTime(hoverTime !== null ? hoverTime : currentTime)}
            </span>
            <span className="h-3 w-px bg-white/30" />
            <span className="text-white">
              {formatTime(duration)}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* Main progress container */}
      <div 
        ref={progressRef}
        tabIndex={0}
        className="w-full flex items-center cursor-pointer group relative progress-container outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg my-2"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        aria-label="Video progress scrubber"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={getCurrentPercent}
      >
        {/* Hover position indicator */}
        <AnimatePresence>
          {hoverPosition !== null && (
            <motion.div
              className="absolute h-full w-0.5 bg-white/70 z-10 pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
              initial={{ opacity: 0, height: "50%" }}
              animate={{ opacity: 1, height: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
        
        {/* Progress bar base */}
        <div className={`w-full ${showWaveform ? 'h-8' : 'h-2'} ${colorClasses.base} rounded-lg relative overflow-hidden transition-all duration-300 progress-bar`}>
          {/* Chapter markers */}
          {chapters.map((chapter, index) => {
            const position = (chapter.time / duration) * 100;
            return (
              <div 
                key={`chapter-${index}`}
                className="chapter-marker group"
                style={{ left: `${position}%` }}
                title={chapter.title}
              >
                <div className="hidden group-hover:block absolute bottom-full mb-2 p-1 bg-black text-white text-xs rounded whitespace-nowrap transform -translate-x-1/2">
                  {chapter.title}
                </div>
              </div>
            );
          })}
          
          {/* Waveform visualization */}
          {showWaveform && (
            <div className="absolute inset-0 z-1">
              <canvas 
                ref={waveformRef} 
                className="w-full h-full"
                style={{ opacity: 0.9 }}
              />
            </div>
          )}
          
          {/* Buffered progress */}
          <div 
            className="absolute h-full bg-white/10 z-1" 
            style={{ width: `${getBufferedPercent}%` }}
          />
          
          {/* Playback progress */}
          <div 
            className={`absolute h-full ${colorClasses.accent} z-2 rounded-lg`} 
            style={{ width: `${getCurrentPercent}%` }}
          >
            {/* Add subtle shimmer effect to played area */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent shine-animation" 
                style={{ 
                  transform: "translateX(-100%)",
                  animation: "shine 3s infinite" 
                }}
              />
            </div>
          </div>
          
          {/* Progress thumb */}
          <motion.div
            className={`absolute h-5 w-5 ${colorClasses.thumb} rounded-full transform -translate-x-1/2 z-10 shadow-lg progress-thumb ${isDragging ? 'active' : ''}`}
            style={{ 
              left: `${getCurrentPercent}%`,
              top: '50%',
              marginTop: '-10px'
            }}
            animate={{
              scale: isDragging ? 1.5 : 1,
              boxShadow: isDragging ? `0 0 0 8px ${colorClasses.glow}` : `0 0 0 0px ${colorClasses.glow}`
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {/* Inner ring */}
            <div className="absolute inset-1.5 rounded-full bg-white/30"></div>
          </motion.div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs font-medium text-zinc-300 mt-1">
        <div className="flex items-center gap-2">
          <span>{formatTime(currentTime)}</span>
          <span className="text-zinc-500">/</span>
          <span className="text-zinc-400">{formatTime(duration)}</span>
        </div>
        
        {/* Waveform toggle button */}
        <button 
          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${showWaveform ? 'bg-purple-500/20 text-purple-200' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWaveform();
          }}
        >
          {showWaveform ? 'Hide Waveform' : 'Show Waveform'}
        </button>
      </div>
    </div>
  );
};

export default VideoProgress;