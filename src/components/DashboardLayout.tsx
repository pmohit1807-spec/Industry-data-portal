import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Map, Tractor, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MadeWithDyad } from './made-with-dyad';
import { Button } from './ui/button';
import { useSession } from './SessionProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { useTractorSales } from '@/hooks/useTractorSales';
import { TractorSale } from '@/data/tractorData';
import { parseMonthString } from '@/utils/dateUtils';
import MonthRangeSelector from './MonthRangeSelector';

const navItems = [
  { name: 'Executive Overview', path: '/', icon: LayoutDashboard },
  { name: 'Regional Analysis', path: '/regional', icon: Map },
  { name: 'Product Segment', path: '/segments', icon: Tractor },
  { name: 'Competitive Deep Dive', path: '/competitive', icon: BarChart3 },
  { name: 'Data Upload', path: '/upload', icon: Upload },
];

// --- Sales Data Context Setup ---

interface SalesDataContextType {
  rawSalesData: TractorSale[] | undefined;
  filteredSalesData: TractorSale[] | undefined;
  allMonths: string[];
  startMonth: string | undefined;
  endMonth: string | undefined;
  setStartMonth: (month: string) => void;
  setEndMonth: (month: string) => void;
  isLoading: boolean;
  isError: boolean;
}

const SalesDataContext = createContext<SalesDataContextType | undefined>(undefined);

export const useSalesData = () => {
  const context = useContext(SalesDataContext);
  if (context === undefined) {
    throw new Error("useSalesData must be used within a SalesDataProvider");
  }
  return context;
};

// --- Sidebar Component ---

const Sidebar: React.FC = () => {
  const { user } = useSession();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Failed to sign out.");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-sidebar text-sidebar-foreground p-4">
      <div className="text-2xl font-bold mb-8 text-sidebar-primary">
        Tractor Sales
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <p className="text-sm mb-2 truncate">
          Logged in as: <span className="font-medium">{user?.email}</span>
        </p>
        <Button 
          onClick={handleSignOut} 
          variant="secondary" 
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent-foreground hover:text-sidebar-accent"
        >
          Sign Out
        </Button>
        <MadeWithDyad />
      </div>
    </div>
  );
};

// --- Dashboard Layout Component (updated) ---

const DashboardLayout: React.FC = () => {
  const { data: rawSalesData, isLoading, isError } = useTractorSales();
  
  // Calculate all unique months from raw data
  const allMonths = useMemo(() => {
    if (!rawSalesData) return [];
    const uniqueMonths = Array.from(new Set(rawSalesData.map(d => d.month)));
    return uniqueMonths.sort((a, b) => 
      parseMonthString(a).getTime() - parseMonthString(b).getTime()
    );
  }, [rawSalesData]);
  
  // State for filtering
  const [startMonth, setStartMonth] = useState<string | undefined>(undefined);
  const [endMonth, setEndMonth] = useState<string | undefined>(undefined);

  // Initialize filters to cover the full range when data loads
  useEffect(() => {
    if (allMonths.length > 0) {
      if (!startMonth) setStartMonth(allMonths[0]);
      if (!endMonth) setEndMonth(allMonths[allMonths.length - 1]);
    }
  }, [allMonths, startMonth, endMonth]);

  // Filter the data based on the selected range
  const filteredSalesData = useMemo(() => {
    if (!rawSalesData || !startMonth || !endMonth || allMonths.length === 0) return rawSalesData;
    
    const startIndex = allMonths.indexOf(startMonth);
    const endIndex = allMonths.indexOf(endMonth);
    
    if (startIndex === -1 || endIndex === -1) return rawSalesData;
    
    // Determine the effective range of months (handling potential start > end selection)
    const effectiveStart = Math.min(startIndex, endIndex);
    const effectiveEnd = Math.max(startIndex, endIndex);
    
    const monthsInFilter = allMonths.slice(effectiveStart, effectiveEnd + 1);
    
    return rawSalesData.filter(d => monthsInFilter.includes(d.month));
    
  }, [rawSalesData, startMonth, endMonth, allMonths]);


  return (
    <SalesDataContext.Provider value={{
      rawSalesData,
      filteredSalesData,
      allMonths,
      startMonth,
      endMonth,
      setStartMonth,
      setEndMonth,
      isLoading,
      isError: isError,
    }}>
      <div className="flex min-h-screen bg-background">
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar />
        </aside>
        <main className="flex-grow p-4 md:p-8 overflow-y-auto">
          <div className="mb-6 flex justify-end">
            {allMonths.length > 0 && (
              <MonthRangeSelector
                allMonths={allMonths}
                startMonth={startMonth}
                endMonth={endMonth}
                onStartMonthChange={setStartMonth}
                onEndMonthChange={setEndMonth}
              />
            )}
          </div>
          <Outlet />
        </main>
      </div>
    </SalesDataContext.Provider>
  );
};

export default DashboardLayout;