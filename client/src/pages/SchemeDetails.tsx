import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Razorpay from "razorpay";
import axios from "axios";

export default function SchemeDetails() {
  const { firId } = useAuth();
  const [match, params] = useRoute("/scheme/:id");
  const schemeId = params?.id;

  const [amount, setAmount]=useState("");
  const [paying, setPaying]=useState(false);
  const [scheme, setScheme] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [showRedeem, setShowRedeem] = useState(false);

  useEffect(() => {
    if (!firId || !schemeId) return;

    fetch("/api/scheme/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseId: firId,
        schemeId,
      }),
    })
      .then((res) => res.json())
      .then((data) => setScheme(data));
  }, [firId, schemeId]);

  const handleRedeem = async () => {
    const res = await fetch("/api/schemes/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseId: firId,
        schemeId,
        address,
      }),
    });

    const data = await res.json();
    alert(data.message);
    setShowRedeem(false);
  };

  const handlePayment=async()=>{
    if(!amount || Number(amount)<=0){
      alert("Enter valid amount");
      return;
    }
    try{
      setPaying(true);
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: firId,
          entityType: "scheme",
          entityId: schemeId,
          amount: Number(amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        setPaying(false);
        return;
      }
      const options={
        key:data.key,
        amount:data.amount,
        curreny: "INR",
        name:"Gold Scheme",
        description:`Scheme #${schemeId}`,
        order_id: data.orderId,
        handler: async function(response: any){
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: data.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          console.log("Verify status:", verifyRes.status);
          console.log("until here is fine");
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            alert("Payment successful!");
            window.location.reload(); // reload scheme details
          } else {
            alert(verifyData.message);
          }
        },
        prefill:{
          name:"User",
        },
        theme:{
          color:"#D4AF37"
        }
      };
      const razor=new (window as any).Razorpay(options);
      razor.open();
    }
    catch(err){
      console.error(err);
      alert("Payment failed");
    }finally {
      setPaying(false);
    }
  }

    if (!scheme) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
            Loading...
            </div>
        );
    }


  const eligible =
    Number(scheme.totalPaid) >= Number(scheme.targetAmount) &&
    scheme.status !== "reedemed";

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-32 md:pt-36 pb-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-royalGold">
          Scheme #{scheme.id}
        </h2>

        <div className="mt-6 space-y-2 text-gray-300">
          <p>Target: ₹{scheme.targetAmount}</p>
          <p>Paid: ₹{scheme.totalPaid}</p>
          <p>Gold: {scheme.totalGoldGrams} g</p>
          <p>Status: {scheme.status}</p>
        </div>

        {scheme.status==="active" && (
          <div className="mt-10">
            <h3 className="text-xl text-royalGold font-bold mb-4">
              Make Payment
            </h3>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg"
            />

            <button
              onClick={handlePayment}
              disabled={paying}
              className="mt-4 bg-royalGold text-black px-6 py-3 rounded-full font-bold w-full"
            >
              {paying ? "Processing..." : "Pay Now"}
            </button>
          </div>
        )}


        {eligible && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowRedeem(true)}
              className="bg-royalGold text-black px-6 py-3 rounded-full font-bold"
            >
              Redeem Gold
            </button>
          </div>
        )}

        {showRedeem && (
          <div className="mt-6">
            <textarea
              placeholder="Enter delivery address..."
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              onClick={handleRedeem}
              className="mt-4 bg-royalGold text-black px-6 py-2 rounded-full"
            >
              Confirm Redeem
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
