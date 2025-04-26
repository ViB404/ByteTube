"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import VideoPlayer from "@/components/video/VideoPlayer";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;

  return (
    <Layout className="h-screen">
      <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-65px)] overflow-hidden">
        {/* Video Player - 70% width */}
        <div className="w-full lg:w-[70%] h-full bg-black relative">
          <VideoPlayer 
            videoId={videoId} 
            onError={(error) => console.error(error)} 
            className="h-full w-full"
          />
        </div>

        {/* Chat Sidebar - 30% width with internal scrolling */}
        <div className="w-full lg:w-[30%] h-full border-l border-zinc-800 flex flex-col">
          <ChatSidebar roomId={videoId} className="h-full flex flex-col" />
        </div>
      </div>
    </Layout>
  );
}