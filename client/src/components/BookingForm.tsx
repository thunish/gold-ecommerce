import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import type { InsertBooking } from "@shared/schema";

export function BookingForm() {
  const { mutate, isPending } = useCreateBooking();
  
  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      metalType: "gold",
      grams: "",
    },
  });

function onSubmit(data: InsertBooking) {
    mutate(data, {
      onSuccess: (savedData) => {
      const adminPhone = "917997877887"; 

      const message = 
        ` NEW BOOKING RECEIVED %0A` +
        `--------------------------%0A` +
        `Name: ${data.name}%0A` +
        `Phone:${data.phoneNumber}%0A` +
        `Email: ${data.email}%0A` +
        `Metal Type: ${data.metalType.toUpperCase()}%0A` +
        `Weight: ${data.grams} Grams%0A` +
        `Address: ${data.address}%0A` +
        `--------------------------%0A` +
        `_Sent via Hyderabad Fine Gold Web_`;

      window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank");
      form.reset();

      },
  });
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-[#0A0A0A] border border-royalGold/30 gold-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-royalGold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-display font-bold text-center text-royalGold mb-2">
          బుకింగ్ చేయండి
        </h3>
        <p className="text-center text-gray-400 mb-6 font-telugu text-sm">
          🕒 Booking Time: 12 PM – 8 PM మాత్రమే
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-royalGold font-telugu">పేరు (Name)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      className="bg-[#111] border-[#333] focus:border-royalGold text-white h-10 rounded-lg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-royalGold font-telugu">ఈమెయిల్ (Email)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Enter your email" 
                      className="bg-[#111] border-[#333] focus:border-royalGold text-white h-10 rounded-lg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-royalGold font-telugu">ఫోన్ నంబర్ (Phone)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="99999 99999" 
                      className="bg-[#111] border-[#333] focus:border-royalGold text-white h-10 rounded-lg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-royalGold font-telugu">చిరునామా (Address)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your address" 
                      className="bg-[#111] border-[#333] focus:border-royalGold text-white rounded-lg resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-royalGold font-telugu">Gold లేదా Silver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#111] border-[#333] focus:border-royalGold text-white h-10 rounded-lg">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111] border-royalGold/30 text-white">
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grams"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-royalGold font-telugu">గ్రాములు (Grams)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 5" 
                        className="bg-[#111] border-[#333] focus:border-royalGold text-white h-10 rounded-lg"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-12 bg-gradient-to-r from-[#B48F17] via-royalGold to-[#B48F17] text-black font-bold text-lg rounded-lg hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-4"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Book Now <Send className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
