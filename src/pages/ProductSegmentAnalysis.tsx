import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { TractorSale } from '@/data/tractorData';
import SegmentCompositionChart from '@/components/SegmentCompositionChart';
import SegmentDominanceChart from '@/components/SegmentDominanceChart';
import HPTrendAnalysisChart from '@/components/HPTrendAnalysisChart';
import { aggregateSalesForChart } from '@/utils/dataTransformation';
import { parseMonthString } from '@/utils/dateUtils';
import { useSalesData } from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton'; // Import Skeleton

// Define "Your Company" for the dashboard context
const YOUR_COMPANY = "Mahindra";

// --- Data Structures ---

interface SegmentVolumeData {
  hp_range: string;
  totalVolume: number;
}

interface SegmentDominanceData {
  hp_range: string;
  [company: string]: number | string;
}

interface HPTrendData {
  month: string;
  [hp_range: string]: number | string;
}

// --- Data Helpers ---

const getUniqueHPRanges = (salesData: TractorSale[]): string[] => {
  return Array.from(new Set(salesData.map(d => d.hp_range))).sort();
};

// 1. Segment Composition Data (Total Volume by HP Range)
const calculateSegmentComposition = (salesData: TractorSale[], uniqueHPRanges: string[]): SegmentVolumeData[] => {
  const compositionMap = new Map<string, number>();

  for (const sale of salesData) {
    compositionMap.set(sale.hp_range, (compositionMap.get(sale.hp_range) || 0) + sale.units_sold);
  }

  return uniqueHPRanges.map(hp_range => ({
    hp_range,
    totalVolume: compositionMap.get(hp_range) || 0,
  })).filter(d => d.totalVolume > 0);
};

// 2. Segment Dominance Data (Your Company vs Top 2 Competitors by HP Range)
const calculateSegmentDominance = (salesData: TractorSale[], uniqueHPRanges: string[], uniqueCompanies: string[]): SegmentDominanceData[] => {
  const hpCompanySales = new Map<string, Map<string, number>>(); // Key: hp_range -> (Key: company -> sales)

  for (const sale of salesData) {
    const { hp_range, company, units_sold } = sale;

    if (!hpCompanySales.has(hp_range)) {
      hpCompanySales.set(hp_range, new Map());
    }
    const companyMap = hpCompanySales.get(hp_range)!;
    companyMap.set(company, (companyMap.get(company) || 0) + units_sold);
  }

  // Determine Top 2 Competitors (excluding YOUR_COMPANY)
  const competitorSales = uniqueCompanies
    .filter(c => c !== YOUR_COMPANY)
    .map(c => ({ company: c, totalSales: salesData.filter(d => d.company === c).reduce((sum, d) => sum + d.units_sold, 0) }))
    .sort((a, b) => b.totalSales - a.totalSales);
    
  const topCompetitors = competitorSales.slice(0, 2).map(c => c.company);
  const relevantCompanies = [YOUR_COMPANY, ...topCompetitors];

  const dominanceData: SegmentDominanceData[] = [];

  for (const hp_range of uniqueHPRanges) {
    const companyMap = hpCompanySales.get(hp_range) || new Map<string, number>();
    
    const row: SegmentDominanceData = { hp_range };

    relevantCompanies.forEach(company => {
      row[company] = companyMap.get(company) || 0;
    });
    
    // Only include segments that have sales data for relevant companies
    if (Object.values(row).some(v => typeof v === 'number' && v > 0)) {
        dominanceData.push(row);
    }
  }

  return dominanceData;
};

// 3. HP Trend Analysis Data (Sales volume of different HP ranges over time)
const calculateHPTrendAnalysis = (salesData: TractorSale[]): HPTrendData[] => {
  const monthlyAggregates = aggregateSalesForChart(salesData, 'hp_range');
  
  // Sort by month
  return monthlyAggregates.sort((a, b) => 
    parseMonthString(a.month as string).getTime() - parseMonthString(b.month as string).getTime()
  );
};


const ProductSegmentAnalysis: React.FC = () => {
  const { filteredSalesData: salesData, isLoading, isError } = useSalesData();
  
  const uniqueHPRanges = useMemo(() => getUniqueHPRanges(salesData || []), [salesData]);
  const uniqueCompanies = useMemo(() => Array.from(new Set(salesData?.map(d => d.company) || [])), [salesData]);

  // 1. Segment Composition Data
  const segmentCompositionData = useMemo(() => {
    if (!salesData) return [];
    return calculateSegmentComposition(salesData, uniqueHPRanges);
  }, [salesData, uniqueHPRanges]);
  
  // 2. Segment Dominance Data
  const segmentDominanceData = useMemo(() => {
    if (!salesData) return [];
    return calculateSegmentDominance(salesData, uniqueHPRanges, uniqueCompanies);
  }, [salesData, uniqueHPRanges, uniqueCompanies]);
  
  // Extract the keys (companies) that were included in the dominance data calculation
  const dominanceSeriesKeys = useMemo(() => {
    if (segmentDominanceData.length === 0) return [];
    // Extract keys from the first data point, excluding 'hp_range'. 
    // We sort them to ensure consistent rendering order (e.g., Your Company first, then Competitor 1, etc.)
    const keys = Object.keys(segmentDominanceData[0]).filter(key => key !== 'hp_range');
    
    // Ensure 'Your Company' is first, followed by competitors in their calculated order
    const yourCompanyIndex = keys.indexOf(YOUR_COMPANY);
    if (yourCompanyIndex > -1) {
        keys.splice(yourCompanyIndex, 1); // Remove Your Company
        keys.unshift(YOUR_COMPANY); // Add Your Company to the start
    }
    return keys;
  }, [segmentDominanceData]);
  
  // 3. HP Trend Analysis Data
  const hpTrendData = useMemo(() => {
    if (!salesData) return [];
    return calculateHPTrendAnalysis(salesData);
  }, [salesData]);
  
  const hpTrendSeriesKeys = useMemo(() => {
    // Get all HP ranges present in the trend data
    if (hpTrendData.length === 0) return [];
    const keys = new Set<string>();
    hpTrendData.forEach(d => {
      Object.keys(d).forEach(key => {
        if (key !== 'month') keys.add(key);
      });
    });
    return Array.from(keys).sort();
  }, [hpTrendData]);


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
      <h1 className="text-3xl font-bold">Product Segment Analysis: HP Range Performance</h1>
      
      {/* Segment Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Composition (Total Volume by HP Range)</CardTitle>
        </CardHeader>
        <SegmentCompositionChart data={segmentCompositionData} />
      </Card>

      {/* HP Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>HP Trend Analysis (Volume over Time)</CardTitle>
        </CardHeader>
        <HPTrendAnalysisChart data={hpTrendData} seriesKeys={hpTrendSeriesKeys} />
      </Card>
      
      {/* Segment Dominance */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Dominance (Your Company vs. Top Competitors)</CardTitle>
        </CardHeader>
        <SegmentDominanceChart 
          data={segmentDominanceData} 
          yourCompany={YOUR_COMPANY}
          seriesKeys={dominanceSeriesKeys}
        />
      </Card>
    </div>
  );
};

export default ProductSegmentAnalysis;