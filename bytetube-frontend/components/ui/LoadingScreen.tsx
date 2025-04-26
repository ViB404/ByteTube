"use client";

import { Video } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
      <div className="flex items-center gap-2 mb-4 scale-100 animate-pulse">
        <Video className="h-8 w-8 text-purple-500" />
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          StreamView
        </span>
      </div>
      
      <div className="flex gap-2 mt-6">
        <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-3 h-3 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
};

export default LoadingScreen;