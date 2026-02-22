import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/use-products";

export default function Coins() {
  const { data: products, isLoading } = useProducts();
  const [, setLocation]=useLocation();
  const coins = [
    { name: "10g Pure Gold", img: "/images/gold-10g.jpg", desc: "999 Fine Gold" },
    { name: "5g Pure Gold", img: "/images/gold-5g.jpg", desc: "999 Fine Gold" },
    { name: "100g Pure Silver", img: "/images/silver-100g.jpg", desc: "999 Fine Silver" },
    { name: "50g Pure Silver", img: "/images/silver-50g.jpg", desc: "999 Fine Silver" },
  ];

  return (
    <div className="min-h-screen bg-shinyBlack text-white">
      <Header />
      <main className="pt-24 pb-12">
        <section className="py-12 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white">Our Precious Coins</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} onBook={() => setLocation('/booking')} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
