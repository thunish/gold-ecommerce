import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-24 pb-12">
        <section className="py-12 container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-white mb-8">About Hyderabad Fine Gold 999</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                Hyderabad Fine Gold 999 is a leading precious metals dealer based in Hyderabad. 
                We specialize in providing high-quality gold and silver coins with 999 purity.
              </p>
              <p className="font-telugu italic text-2xl text-royalGold">
                "బంగారం కంటే విలువైనది నమ్మకం."
              </p>
              <p>
                Our commitment to transparency and local trust has made us a preferred choice 
                for gold investment in the city. Located at KPHB Colony, we serve our community 
                with integrity and excellence.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
