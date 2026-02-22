import { useEffect, useRef } from "react";
import { useProducts } from "@/hooks/use-products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { BookingForm } from "@/components/BookingForm";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, CreditCard, Banknote, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RateCard } from "@/components/RateCards";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-shinyBlack text-white selection:bg-royalGold selection:text-black">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-shinyBlack/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-20" />
          <img 
            src="/images/gold-pile.jpg" 
            alt="Gold Background" 
            className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]"
          />
        </div>

        <div className="relative z-30 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] text-royalGold mb-6 uppercase">
              Welcome to Royalty
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight">
              Hyderabad <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B48F17] via-[#F4CF57] to-[#B48F17]">
                Fine Gold
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-telugu max-w-2xl mx-auto mb-10 leading-relaxed">
              స్వచ్ఛమైన బంగారం, నమ్మకమైన సేవలు. <br className="hidden md:block" />
              మీ భవిష్యత్తుకు బంగారు బాటలు వేయండి.
            </p>
            
            <button 
              onClick={scrollToBooking}
              className="px-8 py-4 bg-royalGold text-black font-bold text-lg rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1"
            >
              Start Booking Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Daily Prices Section */}
      <section id="prices" className="py-24 bg-[#050505] relative">
        <div className="container mx-auto px-4">

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full bg-[#111] rounded-xl" />
                  <Skeleton className="h-8 w-3/4 bg-[#111]" />
                  <Skeleton className="h-4 w-1/2 bg-[#111]" />
                </div>
              ))}
            </div>
          ) : (
              <main className=" ">

                  <div className="text-center mb-16">
                    <span className="text-royalGold tracking-widest text-sm uppercase font-bold">
                      Live Rates
                    </span>
                    <h2 className="text-4xl md:text-5xl font-telugu font-bold mt-2">
                      ఈరోజు ధరలు
                    </h2>
                    <div className="w-24 h-1 bg-royalGold mx-auto mt-6" />
                  </div>

                  {isLoading ? (
                    <Skeleton className="h-96 w-full bg-[#111] rounded-xl" />
                  ) : (
                    <RateCard products={products} />
                  )}

              </main>
          )}
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-24 bg-[#111] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-royalGold to-black opacity-30" />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display font-bold mb-8 leading-snug">
                Why Hyderabad <br />
                <span className="text-royalGold">Fine Gold 999?</span>
              </h2>

              <ul className="space-y-4 mb-8">
                {[
                  "100% Cash Return",
                  "Pure Gold & Pure Silver Coins",
                  "Local Trusted Store – Hyderabad",
                  "Safe Digital Payments"
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-gray-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-royalGold/20 flex items-center justify-center text-royalGold">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              
              <blockquote className="border-l-4 border-royalGold pl-6 mb-8">
                <p className="text-2xl font-telugu italic text-gray-300 leading-relaxed">
                  "ఇక్కడ లాభం కాదు… నమ్మకం మొదట."
                </p>
                <footer className="text-royalGold mt-4 font-bold text-sm tracking-widest uppercase">
                  - Our Promise
                </footer>
              </blockquote>

              <p className="text-gray-400 leading-relaxed">
                We believe in complete transparency. Our 100% cash return policy ensures 
                that your investment is always liquid and secure. Trust is our most valuable asset.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-royalGold rounded-2xl transform rotate-3 opacity-20" />
              <img 
                src="/images/gold-cart.jpg" 
                alt="Gold Trust" 
                className="relative rounded-2xl shadow-2xl gold-shadow border border-royalGold/20" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-20 bg-shinyBlack border-y border-[#111]">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#111] mb-8 border border-[#333]">
            <CreditCard className="text-royalGold mr-2" size={20} />
            <span className="text-gray-400 text-sm font-telugu">సురక్షితమైన డిజిటల్ చెల్లింపులు</span>
          </div>
          
          <h2 className="text-3xl font-display font-bold text-white mb-12">Payment Options</h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {['PhonePe', 'Google Pay', 'Credit Cards', 'Bank Transfer'].map((method) => (
              <div key={method} className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-[#111] flex items-center justify-center border border-[#333] group-hover:border-royalGold transition-colors mb-3">
                  <Banknote className="text-royalGold" />
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-white">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="contact" ref={bookingRef} className="py-24 bg-[#050505] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#111] to-black opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Ready to Invest in <br />
                <span className="text-royalGold">Your Future?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                Book your gold today. Fill out the form and our executive will contact you shortly to confirm the order and price lock.
              </p>
              <div className="hidden lg:block">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-1 h-12 bg-royalGold" />
                  <div>
                    <p className="font-bold text-white">Visit Store</p>
                    <p className="text-sm text-gray-500">KPHB Colony, Hyderabad</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <a 
        href="https://wa.me/917997877887" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-btn"
      >
        WhatsApp
      </a>
    </div>
  );
}
