import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useTractorSales } from '@/hooks/useTractorSales';
import { Loader2 } from 'lucide-react';
import { TractorSale } from '@/data/tractorData';
import { aggregateSalesByDimension, ComparisonDataPoint } from '@/utils/dataTransformation';
import CompanyComparisonChart from '@/components/CompanyComparisonChart';

// Define "Your Company" for the dashboard context
const YOUR_COMPANY = "Mahindra";

// --- Data Helpers ---

// 1. HP Range Comparison Data (Total sales volume for each company, broken down by HP range)
const calculateHPRangeComparison = (salesData: TractorSale[]): ComparisonDataPoint[] => {
  return aggregateSalesByDimension(salesData, 'hp_range', 'company');
};

// 2. State Comparison Data (Total sales volume for each company, broken down by State)
const calculateStateComparison = (salesData: TractorSale[]): ComparisonDataPoint[] => {
  return aggregateSalesByDimension(salesData, 'state', 'company');
};


const CompetitiveDeepDive: React.FC = () => {
  const { data: salesData, isLoading, isError } = useTractorSales();
  
  const uniqueCompanies = useMemo(() => Array.from(new Set(salesData?.map(d => d.company) || [])).sort(), [salesData]);

  // 1. HP Range Comparison Data
  const hpRangeComparisonData = useMemo(() => {
    if (!salesData) return [];
    return calculateHPRangeComparison(salesData);
  }, [salesData]);
  
  // 2. State Comparison Data
  const stateComparisonData = useMemo(() => {
    if (!salesData) return [];
    return calculateStateComparison(salesData);
  }, [salesData]);
  
  
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center text-destructive">Failed to load sales data.</div>;
  }
  
  if (salesData.length === 0) {
     return <div className="p-8 text-center text-muted-foreground">No sales data available. Please upload data via the Data Upload page.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Competitive Deep Dive: Company Performance Comparison</h1>
      
      {/* Company Performance by HP Range */}
      <Card>
        <CardHeader>
          <CardTitle>Company Performance by HP Range (Total Volume)</CardTitle>
        </CardHeader>
        <CompanyComparisonChart 
          data={hpRangeComparisonData} 
          seriesKeys={uniqueCompanies} 
          xAxisKey="hp_range"
          title="HP Range Comparison"
        />
      </Card>

      {/* Company Performance by State */}
      <Card>
        <CardHeader>
          <CardTitle>Company Performance by State (Total Volume)</CardTitle>
        </CardHeader>
        <CompanyComparisonChart 
          data={stateComparisonData} 
          seriesKeys={uniqueCompanies} 
          xAxisKey="state"
          title="State Comparison"
        />
      </Card>
    </div>
  );
};

export default CompetitiveDeepDive;