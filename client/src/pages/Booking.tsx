import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";

export default function Booking() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-24 pb-12">
        <section className="py-12 container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-white">Book Your Gold</h2>
              <p className="text-gray-400 mt-4">Secure your investment today. 12 PM – 8 PM</p>
            </div>
            <BookingForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
