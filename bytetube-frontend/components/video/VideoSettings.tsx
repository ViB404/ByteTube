interface VideoSettingsProps {
  playbackRate: number;
  changePlaybackRate: (rate: number) => void;
  onClose: () => void;
}

const VideoSettings = ({ playbackRate, changePlaybackRate, onClose }: VideoSettingsProps) => {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  
  return (
    <div className="absolute right-8 bottom-24 bg-zinc-900 rounded-md shadow-lg p-4 w-52 z-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Settings</h3>
        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-white"
          aria-label="Close settings"
        >
          &times;
        </button>
      </div>
      
      <div className="pt-2">
        <p className="text-xs text-zinc-400 mb-2">Playback Speed</p>
        <div className="grid grid-cols-4 gap-2">
          {playbackRates.map(rate => (
            <button
              key={rate}
              onClick={() => changePlaybackRate(rate)}
              className={`text-xs py-1 px-2 rounded ${
                playbackRate === rate 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSettings;