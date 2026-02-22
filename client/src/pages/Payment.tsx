import { useCart } from "@/hooks/use-cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const { items, removeItem, total, clearCart } = useCart();
  const { firId } = useAuth();
  const { toast } = useToast();
  const navigate=useNavigate();
  console.log(items);
  const handlePay = async() => {
    try{
      if(items.length===0) return;
      console.log(firId+" jsbdfkjsd");
      if (!firId) {
        navigate("/login");
        return;
      }
      toast({
        title:"procssing Order",
        description:"Create secure payment session...",
      });
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: firId, // ⚠️ replace with real user id
          products: items,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order creation failed");
      const paymentRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: firId, // ⚠️ replace properly
          entityType: "order",
          entityId: orderData.id,
          amount: orderData.totalAmount,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error("Payment init failed");
      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: "INR",
        name: "Gold Store",
        description: "Order Payment",
        order_id: paymentData.orderId,

        handler: async function (response: any) {
          // 4️⃣ Verify payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: paymentData.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            toast({
              title: "Payment Successful 🎉",
              description: "Your order has been confirmed.",
            });

            window.location.href = "/coins";
          } else {
            toast({
              title: "Verification Failed",
              description: "Payment could not be verified.",
              variant: "destructive",
            });
          }
        },

        prefill: {
          // optionally pass user info
        },

        theme: {
          color: "#D4AF37",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }catch(err){
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-display font-bold text-royalGold mb-8">Your Cart</h2>
          
          {items.length === 0 ? (
            <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5">
              <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
              <Button asChild variant="outline" className="border-royalGold text-royalGold">
                <a href="/coins">Browse Coins</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-[#111] p-6 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                      <p className="text-royalGold">₹{item.price} x {item.quantity}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="bg-[#111] p-8 rounded-xl border border-royalGold/20 h-fit">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                <div className="flex justify-between mb-4 pb-4 border-b border-white/10">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-8">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-royalGold">₹{total.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={handlePay}
                  className="w-full bg-royalGold text-black hover:bg-white font-bold h-12"
                >
                  <CreditCard className="mr-2" size={20} />
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
