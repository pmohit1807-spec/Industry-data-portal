import { Navigate } from "react-router-dom";

const Index = () => {
  // Since the root route is now wrapped by DashboardLayout in App.tsx, 
  // this component is technically redundant, but we keep it simple.
  return <Navigate to="/" replace />;
};

export default Index;