import Link from "next/link";
import { Github, Twitter, Youtube, Coffee, Frown, Laugh, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" }
  ];
  
  // Random quote generator for the footer
  const getRandomQuote = () => {
    const quotes = [
      "It worked on my machine. So it's not a bug, it's a geography problem.",
      "404: Professional developers not found.",
      "If it's stupid and it works, it's not stupid. But it is our codebase.",
      "Code so bad it makes AI cry.",
      "Designed with ♥ and zero sleep.",
      "Warning: Viewing source code may cause emotional damage.",
      "Powered by StackOverflow copy-paste and hopes.",
      "This site wasn't tested on animals, just interns.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };
  
  return (
    <footer className="w-full bg-zinc-950 text-zinc-400 py-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Coffee className="h-5 w-5 text-purple-400" />
              </div>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                ByteTube
              </span>
            </div>
            <p className="text-sm text-zinc-500 max-w-md">
              ByteTube: Where videos might load... eventually. A platform held together by duct tape and wishful thinking.
            </p>
            <div className="mt-6 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Frown className="h-3 w-3" />
                <span>Status: Pretending to work</span>
              </div>
              <div className="flex items-center gap-2">
                <Laugh className="h-3 w-3" />
                <span>Uptime: 60% of the time, works every time</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-zinc-300">Features</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors" onClick={(e) => { e.preventDefault(); alert("Streaming? More like buffering!"); }}>
                  Streaming
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors" onClick={(e) => { e.preventDefault(); alert("Sharing is broken. Like relationships."); }}>
                  Sharing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors" onClick={(e) => { e.preventDefault(); alert("Creating? You'd do a better job than us!"); }}>
                  Creating
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors" onClick={(e) => { e.preventDefault(); alert("Monetization service temporarily moved to our crypto-mining script."); }}>
                  <span className="relative">
                    Monetization
                    <span className="absolute -top-1 -right-6 text-[8px] text-yellow-500 rotate-12">NEW!</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-zinc-300">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors" onClick={(e) => { e.preventDefault(); alert("Careers? We can barely keep this website running!"); }}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h3 className="font-medium mb-4 text-zinc-300">Connect</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); alert(`${link.label}? We don't have the budget for social media.`); }}
                  className="bg-zinc-900 p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
              <h4 className="text-sm font-medium mb-2 text-zinc-300">Newsletter (Fake)</h4>
              <p className="text-xs text-zinc-500 mb-3">
                Subscribe to receive updates, bugs, and disappointment directly to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-zinc-800 rounded-lg px-3 py-2 text-sm flex-grow focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.querySelector('input[type="email"]') as HTMLInputElement;
                    if (input && input.value) {
                      alert(`Thanks for subscribing ${input.value}! We just added your email to a dozen spam lists.`);
                      input.value = '';
                    } else {
                      alert("You need to enter an email. Not that it matters.");
                    }
                  }}
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[10px] text-zinc-600 mt-2 italic">
                *By subscribing you agree to receive daily dad jokes
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-600">
            © {currentYear} ByteTube. No rights reserved. Feel free to copy everything, it's not like we wrote original code anyway.
          </div>
          
          <div className="text-xs text-zinc-600 flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>and</span>
            <Coffee className="h-3 w-3 text-amber-500" />
            <span>and</span>
            <span className="italic">"{getRandomQuote()}"</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;