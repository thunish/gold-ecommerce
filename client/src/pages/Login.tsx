import { useState } from "react";
import { useLocation } from "wouter";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

const getNameFromEmail = (email: string) => {
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

export default function Login() {
  const [, setLocation] = useLocation();
  const {emailId, loading}=useAuth();
  useEffect(()=>{
    console.log(loading+"  "+emailId);
    if(!loading && emailId){
      setLocation("/");
    }
  }, [loading, emailId]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userCred;
      if (isRegistering) {
        userCred=await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Registered successfully", description: "You can now login." });
        setIsRegistering(false);
        setPassword("");
      } else {
        userCred=await signInWithEmailAndPassword(auth, email, password);
        setLocation("/");
      }

      const firebaseUser=userCred.user;
      const finalUser=await axios.post("/api/user/new", {
        name:getNameFromEmail(firebaseUser.email || ""),
        firebaseUid:firebaseUser.uid,
        email:firebaseUser.email
      }, {
        headers:{
          "Content-Type":"application/json"
        }
      });
      

    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Error", description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-[#111] border-royalGold/30 gold-shadow overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-display font-bold text-royalGold">
              {isRegistering ? "Register" : "Login"}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">Hyderabad Fine Gold 999</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-royalGold font-telugu">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#050505] border-[#333] text-white h-12"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-royalGold font-telugu">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#050505] border-[#333] text-white h-12"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-royalGold text-black font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                {isRegistering ? "Create Account" : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-gray-400 hover:text-royalGold transition-colors"
              >
                {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
