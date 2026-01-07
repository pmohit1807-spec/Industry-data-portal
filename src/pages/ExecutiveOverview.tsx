import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { aggregateSalesForChart } from '@/utils/dataTransformation';
import { parseMonthString } from '@/utils/dateUtils';
import TIVTrendChart from '@/components/TIVTrendChart';
import MarketShareChart from '@/components/MarketShareChart';
import CurrentMonthSnapshot from '@/components/CurrentMonthSnapshot';
import { TractorSale } from '@/data/tractorData';
import { useSalesData } from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton'; // Import Skeleton

// Define "Your Company" for the dashboard context
const YOUR_COMPANY = "Mahindra";

// Helper function to calculate TIV and Company Sales per month
const calculateTIVData = (salesData: TractorSale[]) => {
  const monthlyDataMap = new Map<string, { month: string; tiv: number; companySales: number }>();

  for (const sale of salesData) {
    const month = sale.month;
    const unitsSold = sale.units_sold;
    
    if (!monthlyDataMap.has(month)) {
      monthlyDataMap.set(month, { month, tiv: 0, companySales: 0 });
    }

    const record = monthlyDataMap.get(month)!;
    record.tiv += unitsSold;
    
    if (sale.company === YOUR_COMPANY) {
      record.companySales += unitsSold;
    }
  }

  // Sort by month
  const sortedData = Array.from(monthlyDataMap.values()).sort((a, b) => 
    parseMonthString(a.month).getTime() - parseMonthString(b.month).getTime()
  );
  
  return sortedData;
};

// Helper function to calculate Market Share per month
const calculateMarketShareData = (salesData: TractorSale[], uniqueCompanies: string[]) => {
  const monthlyAggregates = aggregateSalesForChart(salesData, 'company');
  
  return monthlyAggregates.map(monthData => {
    const totalSales = uniqueCompanies.reduce((sum, company) => sum + (monthData[company] as number || 0), 0);
    
    const shareData: { month: string; [key: string]: string | number } = { month: monthData.month };
    
    uniqueCompanies.forEach(company => {
      const sales = monthData[company] as number || 0;
      // Store market share as percentage (0 to 100)
      shareData[company] = totalSales > 0 ? (sales / totalSales) * 100 : 0;
    });
    
    return shareData;
  });
};

const ExecutiveOverview: React.FC = () => {
  const { filteredSalesData: salesData, isLoading, isError } = useSalesData();
  
  const uniqueCompanies = useMemo(() => Array.from(new Set(salesData?.map(d => d.company) || [])), [salesData]);

  // 1. TIV Trend Data
  const tivTrendData = useMemo(() => {
    if (!salesData) return [];
    return calculateTIVData(salesData);
  }, [salesData]);
  
  // 2. Market Share Trend Data
  const marketShareData = useMemo(() => {
    if (!salesData) return [];
    return calculateMarketShareData(salesData, uniqueCompanies);
  }, [salesData, uniqueCompanies]);
  
  // 3. Current Month Snapshot Data
  const currentMonthSnapshotData = useMemo(() => {
    if (!salesData || salesData.length === 0) return [];
    
    // Find the latest month in the FILTERED data
    const uniqueMonths = Array.from(new Set(salesData.map(d => d.month)));
    const latestMonth = uniqueMonths.sort((a, b) => parseMonthString(b).getTime() - parseMonthString(a).getTime())[0];
    
    const latestMonthSales = salesData.filter(d => d.month === latestMonth);
    
    const companySalesMap = new Map<string, number>();
    let totalSales = 0;
    
    for (const sale of latestMonthSales) {
      const current = companySalesMap.get(sale.company) || 0;
      companySalesMap.set(sale.company, current + sale.units_sold);
      totalSales += sale.units_sold;
    }
    
    if (totalSales === 0) return [];
    
    return Array.from(companySalesMap.entries()).map(([company, sales]) => ({
      company,
      sales,
      share: (sales / totalSales) * 100,
    }));
    
  }, [salesData]);


  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <div className="p-8 text-center text-destructive">Failed to load sales data.</div>;
  }
  
  if (salesData?.length === 0) {
     return <div className="p-8 text-center text-muted-foreground">No sales data available for the selected period.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Executive Overview: The Pulse of the Industry</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Month Snapshot */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Month Snapshot</CardTitle>
          </CardHeader>
          <CurrentMonthSnapshot data={currentMonthSnapshotData} />
        </Card>
        
        {/* TIV Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Industry Volume (TIV) Trend</CardTitle>
          </CardHeader>
          <TIVTrendChart data={tivTrendData} yourCompany={YOUR_COMPANY} />
        </Card>
      </div>

      {/* Overall Market Share Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Market Share Trend</CardTitle>
        </CardHeader>
        <MarketShareChart data={marketShareData} seriesKeys={uniqueCompanies} />
      </Card>
      
      {/* Placeholder for Data Upload (Moved from Index) */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To manage data, please navigate to the "Data Upload" section in the sidebar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveOverview;