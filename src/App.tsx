import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { SessionProvider } from "./components/SessionProvider";
import DashboardLayout from "./components/DashboardLayout";
import ExecutiveOverview from "./pages/ExecutiveOverview";
import CSVUploadPage from "./pages/CSVUploadPage";
import RegionalAnalysis from "./pages/RegionalAnalysis";
import ProductSegmentAnalysis from "./pages/ProductSegmentAnalysis";
import CompetitiveDeepDive from "./pages/CompetitiveDeepDive"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<ExecutiveOverview />} />
              <Route path="regional" element={<RegionalAnalysis />} />
              <Route path="segments" element={<ProductSegmentAnalysis />} />
              <Route path="competitive" element={<CompetitiveDeepDive />} /> {/* New route */}
              <Route path="upload" element={<CSVUploadPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;