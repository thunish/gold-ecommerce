import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Home from "@/pages/Home";
import Rates from "@/pages/Rates";
import Coins from "@/pages/Coins";
import Booking from "@/pages/Booking";
import Payment from "@/pages/Payment";
import About from "@/pages/About";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import  Schemes  from "./pages/Schemes";
import { BrowserRouter } from "react-router-dom";
import SchemeDetails from "./pages/SchemeDetails";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rates" component={Rates} />
      <Route path="/coins" component={Coins} />
      <Route path="/booking" component={Booking} />
      <Route path="/payment" component={Payment} />
      <Route path="/about" component={About} />
      <Route path="/schemes" component={Schemes}></Route>
      <Route path="/scheme/:id" component={SchemeDetails}></Route>
      <Route path="/login" component={Login}></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
