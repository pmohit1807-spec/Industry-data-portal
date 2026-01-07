import TractorDashboard from "@/components/TractorDashboard";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TractorDashboard />
      <MadeWithDyad />
    </div>
  );
};

export default Index;