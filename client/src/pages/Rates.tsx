import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { RateCard } from "@/components/RateCards";

export default function Rates() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-royalGold selection:text-black">
      <Header />

      <main className="pt-24 pb-12">
        <section className="py-12 container mx-auto px-4">

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

        </section>
      </main>

      <Footer />
    </div>
  );
}
