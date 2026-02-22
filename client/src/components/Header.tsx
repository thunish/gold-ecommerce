import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, ShoppingBag, User as UserIcon, LogOut, Package } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

const QUOTES = [
  "మీ బంగారం మీ దగ్గరే.",
  "బంగారం కంటే విలువైనది నమ్మకం.",
  "ఇక్కడ లాభం కాదు… నమ్మకం మొదట.",
  "Pure Gold. Clear Value."
];

const getNameFromEmail = (email: string) => {
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};


export function Header() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showProfileMenu, setShowProfileMenu]=useState(false);
  const { items } = useCart();
  const {emailId, logout} = useAuth();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-shinyBlack/90 backdrop-blur-md border-b border-royalGold/20">
      {/* Top Bar */}
      <div className="bg-[#111] py-2 border-b border-royalGold/10 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs text-royalGold/80">
          <div className="flex items-center space-x-6">
            <span className="flex items-center hover:text-royalGold transition-colors">
              <Phone className="w-3 h-3 mr-2" /> 7997877887
            </span>
            <span className="flex items-center hover:text-royalGold transition-colors">
              <MapPin className="w-3 h-3 mr-2" /> KPHB Colony, Hyderabad
            </span>
          </div>
          <div className="font-telugu tracking-wide min-w-[200px] text-right overflow-hidden h-4 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 w-full"
              >
                {QUOTES[quoteIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="cursor-pointer group text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold tracking-widest uppercase mb-1">
                Hyderabad Fine Gold
                <span className="ml-2 text-sm bg-royalGold text-black px-1.5 rounded-sm align-middle">999</span>
              </h1>
              <p className="text-gray-400 text-xs md:text-sm font-telugu tracking-[0.2em] group-hover:text-royalGold transition-colors">
                స్వచ్ఛమైన బంగారం, స్వచ్ఛమైన బంధం
              </p>
            </motion.div>
          </Link>

          <nav className="mt-4 md:mt-0 flex space-x-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-center">
            {[
              { name: 'Home', path: '/' },
              { name: 'Rates', path: '/rates' },
              { name: 'Coins', path: '/coins' },
              { name: 'Schemes', path: '/schemes' },
              { name: 'Booking', path: '/booking' },
              { name: 'Payment', path: '/payment' },
              { name: 'About', path: '/about' },
            ].map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className="text-[10px] md:text-sm uppercase tracking-widest text-gray-400 hover:text-royalGold transition-colors relative group py-2 whitespace-nowrap flex items-center"
              >
                {item.name}
                {item.name === 'Payment' && itemCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-royalGold text-black h-4 min-w-[16px] px-1 text-[8px]">
                    {itemCount}
                  </Badge>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-royalGold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div
              className="relative ml-4"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}>
            <button className=" p-2 rounded-full border border-royalGold/30 text-royalGold hover:bg-royalGold hover:text-black transition-all">
              <UserIcon className=" w-5 h-5"></UserIcon>
            </button>
            <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#111] border border-royalGold/20 rounded-md shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex flex-col py-2">
                      {emailId ? (
                        <>
                          <div className="px-4 py-2 border-b border-royalGold/10 mb-1">
                            <p className="text-[10px] text-gray-500 uppercase">Logged in as</p>
                            <p className="text-xs text-royalGold truncate font-medium">{emailId}</p>
                          </div>
                          
                          <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-royalGold/10 hover:text-royalGold">
                            <Package className="w-4 h-4 mr-3" /> Orders
                          </Link>

                          <button 
                            onClick={() => logout()}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                          >
                            <LogOut className="w-4 h-4 mr-3" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <Link href="/login" className="flex items-center px-4 py-2 text-sm text-royalGold hover:bg-royalGold/10">
                          <UserIcon className="w-4 h-4 mr-3" /> Login / Register
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
