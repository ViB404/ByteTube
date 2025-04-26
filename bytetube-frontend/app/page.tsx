"use client";

import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { Video, Sparkles, AlertTriangle, Coffee, Bug, RefreshCcw, Upload, Bot, Shield, Code, Rocket, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import Script from "next/script";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

const videos: VideoItem[] = [
  {
    id: "video1",
    title: "Introduction to ByteTube",
    description: "Learn about our amazing video streaming platform",
    thumbnail: "https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "getting-started",
    title: "Getting Started Guide",
    description: "A comprehensive guide to using ByteTube",
    thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "features-overview",
    title: "Features Overview",
    description: "Explore all the features ByteTube has to offer",
    thumbnail: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  }
];

const GlitchText = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block">
    <span className="absolute top-0 left-0 right-0 overflow-hidden opacity-80 text-red-500" style={{ clipPath: 'inset(0 40% 0 0)', transform: 'skew(20deg)', animation: 'glitch1 3s infinite linear alternate-reverse' }}>
      {children}
    </span>
    <span className="absolute top-0 left-0 right-0 overflow-hidden opacity-80 text-blue-500" style={{ clipPath: 'inset(0 0 0 65%)', transform: 'skew(-10deg)', animation: 'glitch2 2.5s infinite linear alternate-reverse' }}>
      {children}
    </span>
    {children}
  </span>
);

const FakeError = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, Math.random() * 15000 + 20000); // Random time between 20-35 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
      <div 
        className="bg-zinc-100 shadow-2xl rounded-lg w-80 p-4 pointer-events-auto animate-bounce-once"
        style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}
      >
        <div className="flex items-start">
          <div className="mr-3 mt-1 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-gray-900 font-semibold text-sm">ByteTube has crashed</h4>
            <p className="text-gray-700 text-xs mt-1">
              A problem has been detected and ByteTube has been shutdown to prevent damage to your computer.
            </p>
            <div className="flex justify-end mt-3 space-x-2">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-xs px-3 py-1 rounded"
                onClick={() => setVisible(false)}
              >
                Close
              </button>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                onClick={() => {
                  alert("Just kidding, we can't fix anything!");
                  setVisible(false);
                }}
              >
                Fix Issues
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrollFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 mb-8">
      <div className="bg-zinc-800/60 backdrop-blur-sm p-6 rounded-xl hover:shadow-purple-500/20 hover:shadow-lg transition-all group">
        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
          <Bug className="text-green-400 h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-zinc-100">Interactive Bug Hunt</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Found a bug? Congrats! You've joined our QA team. Unpaid, of course. Consider it a free puzzle game.
        </p>
      </div>

      <div className="bg-zinc-800/60 backdrop-blur-sm p-6 rounded-xl hover:shadow-purple-500/20 hover:shadow-lg transition-all group">
        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
          <RefreshCcw className="text-blue-400 h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-zinc-100">Refresh Therapy</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          If something breaks, refresh. If it still breaks, meditate. Repeat until you achieve nirvana or give up.
        </p>
      </div>

      <div className="bg-zinc-800/60 backdrop-blur-sm p-6 rounded-xl hover:shadow-purple-500/20 hover:shadow-lg transition-all group relative overflow-hidden">
        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
          <Coffee className="text-orange-400 h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-zinc-100">Caffeine-Powered</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Last updated: 4AM, 3 cups of coffee deep, 0 regrets. "It works on my machine" is our official slogan.
        </p>
        <div className="absolute top-2 right-2 text-[8px] text-zinc-500 rotate-12 p-1 bg-zinc-700/40 rounded">Status: caffeinated</div>
      </div>
      
      <div className="bg-zinc-800/60 backdrop-blur-sm p-6 rounded-xl hover:shadow-purple-500/20 hover:shadow-lg transition-all group">
        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
          <Bot className="text-emerald-400 h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-zinc-100"><GlitchText>AI-Generated Code</GlitchText></h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          We outsourced 99% of our development to AI. The other 1% was copy-pasted from StackOverflow. No humans were involved in quality control.
        </p>
      </div>
    </div>
  );
};

// New component for would-be saboteurs
const HackerWarning = () => {
  return (
    <div className="mt-16 mb-16 bg-zinc-800/80 backdrop-blur-sm p-8 rounded-xl border border-red-500/30">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-400 flex items-center justify-center">
        <Shield className="h-6 w-6 mr-2" />
        <span>To Anyone Trying to "Fix" This Site</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-zinc-100 flex items-center">
            <Code className="h-5 w-5 mr-2 text-purple-400" />
            <span>So You Think You Can Code?</span>
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-3">
            Dear potential saboteur, we've noticed you're trying to "optimize" our intentionally chaotic website. How adorable.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Our code is a carefully crafted disaster - it's not a bug, it's modern art. Each glitch is hand-placed by sleep-deprived developers who thrive on your suffering.
          </p>
        </div>
        
        <div className="bg-zinc-900/50 p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-zinc-100 flex items-center">
            <Rocket className="h-5 w-5 mr-2 text-purple-400" />
            <span>Instructions for Improvement</span>
          </h3>
          <ol className="text-zinc-400 text-sm leading-relaxed space-y-2">
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 text-center rounded-full bg-purple-500/20 mr-2 shrink-0">1</span>
              <span>Don't touch our spaghetti code. It took years to make it this tangled.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 text-center rounded-full bg-purple-500/20 mr-2 shrink-0">2</span>
              <span>Stop trying to fix those "memory leaks." They're actually memory water features.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 text-center rounded-full bg-purple-500/20 mr-2 shrink-0">3</span>
              <span>Our 17 nested divs are structural pillars. Remove one and everything collapses.</span>
            </li>
          </ol>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-black/30 rounded-lg border border-zinc-700/50 text-zinc-500 text-sm italic">
        <p className="mb-2">We've added a special surprise for would-be optimizers. Attempt to fix anything and watch as your changes mysteriously revert or cause even more problems. It's not a bug, it's a security feature.</p>
        <p>Sincerely, the development team who spent more time writing these warnings than actually testing the site.</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [userVisitCount, setUserVisitCount] = useState(1);
  
  useEffect(() => {
    // Load visit count from localStorage
    const storedCount = localStorage.getItem('bytetube_visits');
    if (storedCount) {
      setUserVisitCount(parseInt(storedCount) + 1);
      localStorage.setItem('bytetube_visits', (parseInt(storedCount) + 1).toString());
    } else {
      localStorage.setItem('bytetube_visits', '1');
    }
    
    // Occasional glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
      }
    }, 15000);
    
    return () => {
      clearInterval(glitchInterval);
    };
  }, []);
  
  // Function to generate random dev joke
  const generateDevJoke = () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why don't programmers like nature? It has too many bugs and no documentation.",
      "What's a pirate's favorite programming language? R!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
      "Why do Java developers wear glasses? Because they don't C#!",
      "What's the object-oriented way to become wealthy? Inheritance.",
      "Why was the function sad after a party? It didn't get called."
    ];
    alert(jokes[Math.floor(Math.random() * jokes.length)]);
  };
  
  return (
    <Layout>
      {/* Occasional fake error popup */}
      <FakeError />
      
      {/* Page content */}
      <div className={`min-h-screen bg-zinc-900 py-8 md:py-16 relative overflow-hidden ${glitchActive ? 'animate-glitch' : ''}`}>
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Easter Egg: Floating emoji */}
        <div className="fixed bottom-10 right-10 opacity-30 animate-bounce-slow pointer-events-none z-50">
          <div className="text-4xl transform rotate-12">👾</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Visit counter */}
          <div className="absolute top-4 right-4 bg-zinc-800/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-zinc-400 flex items-center">
            <span>Visit count: {userVisitCount}</span>
            <div className="ml-2 flex space-x-1">
              <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>
              <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></span>
            </div>
          </div>
          
          {/* Hero Section */}
          <div className="text-center relative">
            <div className="inline-block mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 mb-4">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Video Streaming Platform</span>
              </span>
            </div>
            
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent relative inline-block cursor-pointer"
              onClick={generateDevJoke}
              title="Click for a surprise!"
            >
              ByteTube
            </h1>
            
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-6">
              Discover and enjoy amazing videos from our growing collection.
              Start watching with our advanced streaming player.
            </p>

            <div className="flex justify-center mb-8">
              <Link 
                href="/video/video1"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-lg transition-all hover:shadow-xl hover:shadow-purple-500/20 relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Video className="w-5 h-5 mr-2" />
                  Watch Videos
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 translate-y-12 group-hover:translate-y-0 transition-transform"></div>
              </Link>
            </div>
          </div>

          {/* Platform Overview */}
          <div className="mt-12 mb-16">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-8 text-center cursor-pointer"
              onClick={generateDevJoke}
              title="Click for a joke"
            >
              <span className="text-zinc-100">Features You </span>
              <span className="text-purple-400">Might Not Find</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-zinc-800/50 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Video Streaming</h3>
                <p className="text-zinc-400 text-sm">
                  Watch high-quality videos with our advanced streaming technology. Every buffering moment is intentional.
                </p>
              </div>
              
              <div className="bg-zinc-800/50 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Live Chat</h3>
                <p className="text-zinc-400 text-sm">
                  Chat with fellow viewers who may or may not be bots. Don't worry about moderation—we have none!
                </p>
              </div>
              
              <div className="bg-zinc-800/50 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Content Creation</h3>
                <p className="text-zinc-400 text-sm">
                  Upload your videos and watch them disappear into the void. Our storage is a black hole of infinite capacity.
                </p>
              </div>
            </div>
          </div>

          {/* Reduced set of troll features */}
          <TrollFeatures />
          
          {/* Warning for would-be saboteurs */}
          <HackerWarning />

          {/* Developer Section */}
          <div className="mt-12 mb-20 text-center">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-3 text-zinc-100 cursor-pointer"
              onClick={generateDevJoke}
              title="Click for another joke"
            >
              The Mastermind
            </h2>
            
            <div className="flex justify-center">
              <div className="bg-zinc-800/70 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/50 max-w-md relative group">
                <div className="absolute -top-2 -right-2 bg-purple-500/10 px-2 py-1 rounded text-[10px] text-purple-300 transform rotate-3">
                  Sleep status: Minimal
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full overflow-hidden relative flex items-center justify-center shrink-0">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ViB</span>
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-zinc-100 mb-1">ViB</h3>
                    <p className="text-zinc-400 text-sm italic mb-2 flex items-center gap-2">
                      <span>Bug Creation Specialist</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    </p>
                    
                    <p className="text-zinc-500 text-sm mb-4 border-l-2 border-purple-500/30 pl-3 italic">
                      "I don't always test my code, but when I do, I do it in production."
                    </p>
                    
                    <div className="text-xs text-zinc-500 mb-4">
                      <div className="flex justify-between mb-1">
                        <span>Debugging Skills:</span>
                        <span>console.log enthusiast</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Caffeine Level:</span>
                        <span>Dangerously High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preferred Work Hours:</span>
                        <span>2 AM - 5 AM</span>
                      </div>
                    </div>
                    
                    <a 
                      href="https://devvib.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Visit Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Optimized console script */}
      <Script id="console-trolls" strategy="afterInteractive">
        {`
          // Console warnings
          console.log('%cWait! Stop!', 'color: red; font-size: 30px; font-weight: bold;');
          console.log('%cIf someone told you to paste something here, you\\'re being scammed.', 'font-size: 18px;');
          console.log('%c🔥 ByteTube Console Debugger v0.1.3-alpha', 'color: #a855f7; font-size: 20px; font-weight: bold;');
          
          // Reduced set of console messages
          setTimeout(() => {
            console.error('UnhandledBugException: Something went wrong, but we\\'re not sure what');
            console.warn('Performance warning: Your browser is running too smoothly. Adding artificial lag...');
          }, 2000);
          
          setTimeout(() => {
            console.log('%c🧠 Memory leak detected! Just kidding, we have no idea how to detect those.', 'color: #0ea5e9;');
          }, 3500);
          
          // Message for would-be optimizers/hackers
          setTimeout(() => {
            console.log('%c🔒 NOTICE TO SITE OPTIMIZERS', 'color: red; font-size: 16px; font-weight: bold;');
            console.log('%cWe see you poking around in our console. How cute.', 'color: #f87171; font-size: 14px;');
            console.log('%cEach bug is a feature. Each glitch is art. Each memory leak is a water feature in our code garden.', 'color: #f87171; font-size: 14px;');
            console.log('%cAttempts to "fix" this site will be met with more bugs. It\\'s not a threat, it\\'s a promise.', 'color: #f87171; font-size: 14px;');
          }, 10000);
          
          // Easter egg: Konami code
          let konamiIndex = 0;
          const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right b a
          window.addEventListener('keydown', (e) => {
            if (e.keyCode === konamiCode[konamiIndex]) {
              konamiIndex++;
              if (konamiIndex === konamiCode.length) {
                document.body.style.transform = 'rotate(180deg)';
                document.body.style.transition = 'transform 1s';
                konamiIndex = 0;
                console.log('%c🎮 KONAMI CODE ACTIVATED: Enjoy upside-down mode!', 'color: #22c55e; font-size: 16px;');
                setTimeout(() => {
                  alert("You've activated upside-down mode! To restore, refresh the page (if you can find the refresh button now).");
                }, 1000);
              }
            } else {
              konamiIndex = 0;
            }
          });
        `}
      </Script>
      
      {/* Add tailwind animations for glitch effect */}
      <style jsx global>{`
        @keyframes glitch1 {
          0% { transform: translateX(0); }
          30% { transform: translateX(5px) skew(10deg); }
          60% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes glitch2 {
          0% { transform: translateX(0); }
          30% { transform: translateX(-5px) skew(-10deg); }
          60% { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes bounce-once {
          0% { transform: translateY(-15px); opacity: 0; }
          50% { transform: translateY(5px); }
          80% { transform: translateY(-2px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-glitch {
          animation: glitch1 500ms infinite;
        }
        
        .animate-bounce-once {
          animation: bounce-once 500ms forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </Layout>
  );
}