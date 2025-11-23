import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { useWebSocket } from "@/hooks/use-websocket";
import Dashboard from "@/pages/Dashboard";
import LiveMatch from "@/pages/LiveMatch";
import Rankings from "@/pages/Rankings";
import Schedule from "@/pages/Schedule";
import Players from "@/pages/Players";
import Analytics from "@/pages/Analytics";
import AdminDashboard from "@/pages/AdminDashboard";
import RefereeDashboard from "@/pages/RefereeDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/match/:id" component={LiveMatch} />
      <Route path="/rankings" component={Rankings} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/players" component={Players} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/referee" component={RefereeDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  useWebSocket();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Router />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
