"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { StartSchemeModal } from "@/components/StartSchemeModal";
import axios from "axios";

export default function Schemes() {
  const { firId } = useAuth();
  const navigate=useNavigate();
  const [open, setOpen] = useState(false);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    if (!firId) {
      navigate("/login");
      return;
    }
    setOpen(true);
  };
  useEffect(() => {
    if (!firId) return;

    const fetchSchemes = async () => {
        try {
        setLoading(true);
        const res = await axios.post(
            "/api/schemes/list",
            { firebaseId: firId }
        );

        setSchemes(res.data);
        } catch (err) {
        console.error("Failed to fetch schemes");
        } finally {
        setLoading(false);
        }
    };

    fetchSchemes();
    }, [firId]);

    console.log(schemes);
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-32 md:pt-36 pb-16 container mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-royalGold tracking-widest text-sm uppercase font-bold">
            Gold Saving Scheme
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            మా గోల్డ్ సేవింగ్ స్కీమ్
          </h1>

          <div className="w-24 h-1 bg-royalGold mx-auto mt-6" />
        </div>

        {/* Explanation Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6 text-gray-300 text-lg leading-relaxed">

          <p>
            Begin your gold savings journey with a minimum starting amount of ₹10,000 to activate your scheme. 
            Once started, you can add money anytime — no fixed schedule, no pressure. 
            You may contribute any amount, even as little as ₹10, whenever it is convenient for you. 
            Every payment is converted into gold grams based on the live gold rate at the time of payment. 
            Once your savings goal is complete, you can redeem it as physical gold.
          </p>

          <p className="text-xl text-white font-semibold">
            ఈ పథకాన్ని ప్రారంభించడానికి కనీసం ₹10,000తో నమోదు చేయాలి. 
            ఒకసారి ప్రారంభించిన తర్వాత, మీరు మీకు వీలైన సమయంలో ఎంతైనా మొత్తాన్ని జోడించవచ్చు — 
            అది ₹10 అయినా సరే. ప్రతి చెల్లింపు సమయంలో ఉన్న ప్రస్తుత గోల్డ్ రేటు ప్రకారం 
            గ్రాములు మీ ఖాతాలో చేరుతాయి. మొత్తం పూర్తైన తర్వాత, మీరు ఫిజికల్ గోల్డ్‌గా పొందవచ్చు.
          </p>

        </div>

        <div className="mt-16">

        {loading && (
            <p className="text-center text-gray-400">Loading schemes...</p>
        )}

        {!loading && schemes.length === 0 && firId && (
            <p className="text-center text-gray-500">
            You have not started any scheme yet.
            </p>
        )}

        <div className="grid md:grid-cols-2 gap-8 mt-8">
            {schemes.map((scheme) => (
            
            <div
                key={scheme.id}
                className="bg-[#111] border border-royalGold/30 rounded-2xl p-6 shadow-xl hover:scale-105 transition"
            >
                <h3 className="text-2xl font-bold text-royalGold mb-4">
                Scheme #{scheme.id}
                </h3>

                <div className="space-y-2 text-gray-300">

                <p>
                    <span className="text-white font-semibold">
                    Total Amount:
                    </span>{" "}
                    ₹{scheme.targetAmount}
                </p>

                <p>
                    <span className="text-white font-semibold">
                    Paid:
                    </span>{" "}
                    ₹{scheme.totalPaid}
                </p>

                <p>
                    <span className="text-white font-semibold">
                    Gold Accumulated:
                    </span>{" "}
                    {scheme.totalGoldGrams} gm
                </p>

                <p>
                    <span className="text-white font-semibold">
                    Status:
                    </span>{" "}
                    {scheme.status}
                </p>

                </div>

                <button
                onClick={() => navigate(`/scheme/${scheme.id}`)}
                className="mt-6 w-full bg-royalGold text-black py-2 rounded-lg font-bold"
                >
                View Details
                </button>

            </div>
            ))}
        </div>
        </div>


        {/* Start Button */}
        <div className="flex justify-center mt-14">
          <button
            onClick={handleStart}
            className="bg-royalGold hover:bg-yellow-500 text-black font-bold px-10 py-4 rounded-full text-lg transition"
          >
            Start New Scheme
          </button>
        </div>

      </main>

      <Footer />

      {/* Modal */}
      {open && <StartSchemeModal onClose={() => setOpen(false)} />}
    </div>
  );
}
