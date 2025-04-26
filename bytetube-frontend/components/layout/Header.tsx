"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Bell, Search, Menu, X, AlertTriangle, User, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Random notification count
    const interval = setInterval(() => {
      setNotificationCount(Math.floor(Math.random() * 10) + 1);
    }, 30000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const breakThings = () => {
    const r = Math.random();
    if (r > 0.7) {
      document.body.style.filter = "hue-rotate(180deg)";
      setTimeout(() => { document.body.style.filter = ""; }, 1000);
    } else if (r > 0.4) {
      document.body.style.transform = "skew(2deg, 1deg)";
      setTimeout(() => { document.body.style.transform = ""; }, 1500);
    } else {
      alert("Feature not implemented: We're too lazy to break things properly.");
    }
  };

  return (
    <header 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-zinc-900/95 backdrop-blur-md shadow-lg shadow-purple-500/5" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold relative group">
            <motion.div 
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 rounded-lg"
            >
              <Video className="h-5 w-5 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ByteTube
            </span>
            <span className="absolute -top-1 -right-3 text-[8px] text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">beta?</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link 
              href="#" 
              className="text-zinc-400 hover:text-zinc-100 transition-colors relative group"
              onClick={(e) => { e.preventDefault(); breakThings(); }}
            >
              Home
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link 
              href="#" 
              className="text-zinc-400 hover:text-zinc-100 transition-colors relative group"
              onClick={(e) => { e.preventDefault(); breakThings(); }}
            >
              Explore
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link 
              href="#"
              className="text-zinc-400 hover:text-zinc-100 transition-colors relative group"
              onClick={(e) => { e.preventDefault(); alert("Subscriptions? In this economy?"); }}
            >
              Subscriptions
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "300px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative hidden md:block"
            >
              <input 
                type="text" 
                placeholder="Search (good luck with that)"
                className="w-full bg-zinc-800/90 text-zinc-200 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                autoFocus
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert("Search is decorative. Like most of our features.");
                    setSearchOpen(false);
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </motion.div>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800/50"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          
          <button 
            className="p-2.5 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800/50 relative"
            onClick={() => alert("Notifications: Nothing important, we promise.")}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {notificationCount}
              </span>
            )}
          </button>
          
          <button 
            className="p-2.5 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800/50 relative group md:flex hidden items-center"
            onClick={() => alert("You must be logged in to-- oh wait, we don't have auth.")}
          >
            <User className="h-5 w-5" />
            <div className="absolute bg-zinc-800 rounded-lg p-2 text-xs text-zinc-400 right-0 top-full mt-2 w-28 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="flex items-center gap-2">
                <Coffee className="h-3 w-3" />
                <span>Not signed in</span>
              </div>
            </div>
          </button>
          
          {/* Mobile menu button */}
          <button 
            className="p-2.5 text-zinc-400 hover:text-zinc-100 md:hidden transition-colors rounded-full hover:bg-zinc-800/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800/50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <input 
                  type="text" 
                  placeholder="Search (it doesn't work)"
                  className="w-full bg-zinc-800/90 text-zinc-200 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      alert("Mobile search is even less functional than desktop search.");
                    }
                  }}
                />
              </div>
              
              <nav className="flex flex-col gap-4">
                <Link 
                  href="#" 
                  className="text-zinc-300 py-2 px-3 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-3"
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); }}
                >
                  Home
                </Link>
                <Link 
                  href="#" 
                  className="text-zinc-300 py-2 px-3 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-3"
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); }}
                >
                  Explore
                </Link>
                <Link 
                  href="#" 
                  className="text-zinc-300 py-2 px-3 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-3 relative"
                  onClick={(e) => { e.preventDefault(); alert("You need a subscription to use subscriptions."); setMobileMenuOpen(false); }}
                >
                  Subscriptions
                  <div className="absolute right-3 top-3 w-2 h-2 bg-red-500 rounded-full"></div>
                </Link>
              </nav>
              
              <div className="pt-2 border-t border-zinc-800/50 text-zinc-500 text-xs flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                <span>Mobile version highly unstable</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;