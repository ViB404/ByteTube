import { 
  Play, Pause, Volume2, VolumeX, Volume1, 
  Maximize, Settings, RotateCw, ChevronRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useRef, useEffect } from "react";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  togglePlay: () => void;
  toggleMute: () => void;
  changeVolume: (volume: number) => void;
  toggleFullscreen: () => void;
  toggleSettings: () => void;
  changePlaybackRate: (rate: number) => void;
}

const VideoControls = ({
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  togglePlay,
  toggleMute,
  changeVolume,
  toggleFullscreen,
  toggleSettings,
  changePlaybackRate
}: VideoControlsProps) => {
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speedRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  // Handle volume hover timeout
  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  const handleVolumeMouseEnter = () => {
    setIsVolumeHovered(true);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
      volumeTimeoutRef.current = null;
    }
  };

  const handleVolumeMouseLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setIsVolumeHovered(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-between mt-2 relative">
      {/* Left side controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause button with ripple effect */}
        <button 
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/90 hover:bg-purple-600 hover:scale-105 transition-all duration-200 shadow-lg relative group overflow-hidden"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 group-active:scale-90 rounded-full transition-all duration-300"></span>
          {isPlaying ? 
            <Pause className="h-5 w-5 text-white" /> : 
            <Play className="h-5 w-5 text-white ml-0.5" />
          }
        </button>
        
        {/* Volume controls with expandable slider */}
        <div 
          className="flex items-center gap-2 relative"
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
        >
          <button 
            onClick={toggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon />
          </button>
          
          <div 
            className={`h-9 overflow-hidden transition-all duration-300 flex items-center ${
              isVolumeHovered ? 'w-28 opacity-100' : 'w-0 opacity-0 sm:opacity-100 sm:w-24'
            }`}
          >
            <div className="w-full px-2">
              <div className="relative w-full h-2 bg-zinc-800/80 rounded-full">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-3.5 
                    [&::-webkit-slider-thumb]:h-3.5 
                    [&::-webkit-slider-thumb]:bg-white 
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:mt-[-3px]
                    hover:[&::-webkit-slider-thumb]:bg-purple-100"
                  aria-label="Volume"
                />
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" 
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Playback rate selector */}
        <div className="relative">
          <button 
            onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
            className="h-8 px-2.5 flex items-center gap-1 text-xs font-medium rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors"
            aria-label="Playback speed"
          >
            <RotateCw size={14} />
            <span>{playbackRate}x</span>
          </button>
          
          {isSpeedMenuOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-zinc-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-zinc-800 p-1.5 min-w-[100px] z-50">
              <div className="flex flex-col gap-1">
                {speedRates.map(rate => (
                  <button
                    key={rate}
                    onClick={() => {
                      changePlaybackRate(rate);
                      setIsSpeedMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md text-left flex items-center justify-between transition-colors
                      ${playbackRate === rate ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-zinc-800'}`}
                  >
                    <span>{rate}x</span>
                    {playbackRate === rate && <ChevronRight size={14} className="text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Settings button - disabled as per requirement */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors cursor-not-allowed opacity-50"
                disabled
                aria-label="Settings (Coming soon)"
              >
                <Settings size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-900/95 backdrop-blur-sm border-zinc-800 px-3 py-1.5 text-xs">
              <p>Settings coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Fullscreen button */}
        <button 
          onClick={toggleFullscreen}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors"
          aria-label="Toggle fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* Click away handler for speed menu */}
      {isSpeedMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsSpeedMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default VideoControls;