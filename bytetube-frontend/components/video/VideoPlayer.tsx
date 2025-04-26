"use client";

import { useRef, useState, useEffect } from "react";
import VideoControls from "./VideoControls";
import VideoProgress from "./VideoProgress";
import VideoSettings from "./VideoSettings";
import useVideoPlayer from "@/hooks/useVideoPlayer";

interface VideoPlayerProps {
  videoId: string;
  onError: (message: string) => void;
  className?: string;
}

const VideoPlayer = ({ videoId, onError, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // Define API URL with fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  const {
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    playbackRate,
    togglePlay,
    toggleMute,
    changeVolume,
    changePlaybackRate,
    seekTo,
    toggleFullscreen,
  } = useVideoPlayer(videoRef);

  // Calculate buffered end time as a number
  const getBufferedEnd = () => {
    if (!buffered || buffered.length === 0) return 0;
    return buffered.end(buffered.length - 1);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => {
      setIsLoading(false);
      setIsBuffering(false);
      setHasError(true);
      onError("Failed to load video. Please try again.");
    };

    // Load metadata as soon as possible
    const handleLoadedMetadata = () => {
      if (video.duration) {
        // Force update duration once metadata is loaded
        video.dispatchEvent(new Event('durationchange'));
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [onError]);

  // Handle controls visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => setControlsVisible(true);
    const handleMouseLeave = () => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black group ${className || ''}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={hasError ? undefined : `${apiUrl}/video/${videoId}`}
        playsInline
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <p className="text-white text-lg">Video unavailable. Please check the URL or try again later.</p>
        </div>
      )}

      {/* Initial loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Buffering during playback */}
      {isBuffering && isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Play button overlay when video is not playing */}
      {!isPlaying && !isLoading && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-purple-500 bg-opacity-80 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {!hasError && (
        <>
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <VideoProgress
              currentTime={currentTime}
              duration={duration}
              buffered={getBufferedEnd()}
              onSeek={seekTo}
            />
            
            <VideoControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              playbackRate={playbackRate}
              togglePlay={togglePlay}
              toggleMute={toggleMute}
              changeVolume={changeVolume}
              toggleFullscreen={() => toggleFullscreen(containerRef)}
              toggleSettings={() => setShowSettings(!showSettings)}
              changePlaybackRate={changePlaybackRate}
            />
          </div>

          {showSettings && (
            <VideoSettings
              playbackRate={playbackRate}
              changePlaybackRate={changePlaybackRate}
              onClose={() => setShowSettings(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;