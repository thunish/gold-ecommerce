import { Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-royalGold/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-royalGold mb-4">
              HYDERABAD FINE GOLD
            </h3>
            <p className="text-gray-500 leading-relaxed font-telugu mb-6">
              మా వద్ద స్వచ్ఛమైన 999 బంగారం లభిస్తుంది. 
              వినియోగదారుల నమ్మకమే మాకు ముఖ్యం. 
              సురక్షితమైన మరియు పారదర్శకమైన లావాదేవీలు.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center text-royalGold hover:bg-royalGold hover:text-black transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {['Today Prices', 'About Us', 'Services', 'Terms & Conditions'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-royalGold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h4>
            <div className="flex flex-col items-center md:items-end space-y-4 text-gray-400">
              <a href="tel:7997877887" className="flex items-center hover:text-royalGold transition-colors group">
                <span className="group-hover:translate-x-[-5px] transition-transform">7997877887</span>
                <Phone className="w-4 h-4 ml-3 text-royalGold" />
              </a>
              <div className="flex items-start justify-end hover:text-royalGold transition-colors group text-right">
                <span className="group-hover:translate-x-[-5px] transition-transform max-w-[200px]">
                  KPHB Colony, Hyderabad,<br />Telangana, 500072
                </span>
                <MapPin className="w-4 h-4 ml-3 mt-1 text-royalGold" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>© 2024 Hyderabad Fine Gold. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-telugu">మీ బంగారం మీ దగ్గరే</p>
        </div>
      </div>
    </footer>
  );
}
