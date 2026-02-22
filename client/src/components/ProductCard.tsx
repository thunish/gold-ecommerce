import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onBook: () => void;
}

export function ProductCard({ product, onBook }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  // Determine image based on category if URL is missing or generic
  const displayImage = product.imageUrl || 
    (product.category === 'gold' ? "/images/gold-10g.jpg" : "/images/silver-100g.jpg");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-[#111] border border-white/10 rounded-xl overflow-hidden gold-shadow hover:border-royalGold/50 transition-colors duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src={displayImage} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1 bg-royalGold text-black text-xs font-bold rounded-full uppercase tracking-wider">
            {product.category === 'gold' ? '24K Gold' : 'Pure Silver'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display font-semibold text-royalGold mb-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between mt-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-gray-500 font-telugu mb-1">ప్రస్తుత ధర</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              ₹{product.price}
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-12 h-12 rounded-full bg-royalGold flex items-center justify-center text-black hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
