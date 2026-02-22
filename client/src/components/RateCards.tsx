import { motion } from "framer-motion";
import type { Product } from "@shared/schema";

interface RateCardProps {
  products?: (Product & { price: number })[];
}

export function RateCard({ products }: RateCardProps) {
  if (!products) return null;

  // Filter inside component
  const filtered = products.filter(
    (p) =>
      (p.category === "gold" && p.quantity === 10) ||
      (p.category === "silver" && p.quantity === 1000)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {filtered.map((product, index) => {
        const isGold = product.category === "gold";

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`group relative bg-[#111] rounded-2xl overflow-hidden border ${
              isGold
                ? "border-royalGold/40 hover:border-royalGold"
                : "border-white/20 hover:border-white/40"
            } transition-all duration-300`}
          >
            {/* Image */}
            <div className="aspect-[4/3] bg-black overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute bottom-4 left-4 z-20">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    isGold
                      ? "bg-royalGold text-black"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {isGold ? "24K Gold" : "Pure Silver"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3
                className={`text-xl font-display font-semibold mb-2 ${
                  isGold ? "text-royalGold" : "text-gray-300"
                }`}
              >
                {isGold ? "24K Gold - 10 గ్రాములు" : "Pure Silver - 1000 గ్రాములు"}
              </h3>

              <p className="text-gray-400 text-sm mb-4">
                {product.description}
              </p>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500 font-telugu mb-1">
                  ప్రస్తుత ధర
                </p>

                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  ₹{product.price}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
