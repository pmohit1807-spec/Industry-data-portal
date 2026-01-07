import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CardContent } from '@/components/ui/card';

interface SegmentDominanceData {
  hp_range: string;
  [company: string]: number | string;
}

interface SegmentDominanceChartProps {
  data: SegmentDominanceData[];
  yourCompany: string;
}

// Color palette for comparison
const COLORS = {
    'Your Company': '#10b981', // Green for own company
    'Competitor 1': '#3b82f6', // Blue
    'Competitor 2': '#f59e0b', // Yellow/Orange
};

const SegmentDominanceChart: React.FC<SegmentDominanceChartProps> = ({ data, yourCompany }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No segment dominance data available.
      </CardContent>
    );
  }
  
  // Dynamically determine series keys (companies) present in the data
  const seriesKeys = Object.keys(data[0]).filter(key => key !== 'hp_range');
  
  // Map keys to display names and colors
  const getDisplayName = (key: string, index: number) => {
      if (key === yourCompany) return 'Your Company';
      return `Competitor ${index}`;
  };
  
  const getFillColor = (key: string) => {
      if (key === yourCompany) return COLORS['Your Company'];
      if (seriesKeys.indexOf(key) === 1) return COLORS['Competitor 1'];
      if (seriesKeys.indexOf(key) === 2) return COLORS['Competitor 2'];
      return '#94a3b8'; // Default gray for others if somehow more than 3 appear
  };

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="hp_range" stroke="hsl(var(--foreground))" />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
            formatter={(value: number, name: string) => [value.toLocaleString(), name]}
          />
          <Legend />
          
          {seriesKeys.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              name={getDisplayName(key, index)} 
              fill={getFillColor(key)} 
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default SegmentDominanceChart;