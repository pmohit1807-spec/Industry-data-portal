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
  seriesKeys: string[]; // Explicitly passed keys for rendering
}

// Color palette for comparison
const COLORS = {
    'Your Company': '#10b981', // Green for own company
    'Competitor 1': '#3b82f6', // Blue
    'Competitor 2': '#f59e0b', // Yellow/Orange
};

const SegmentDominanceChart: React.FC<SegmentDominanceChartProps> = ({ data, yourCompany, seriesKeys }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No segment dominance data available.
      </CardContent>
    );
  }
  
  // Map keys to display names and colors
  const getDisplayName = (key: string) => {
      if (key === yourCompany) return 'Your Company';
      
      // Find the index of the competitor among the non-YourCompany keys
      const competitorKeys = seriesKeys.filter(k => k !== yourCompany);
      const index = competitorKeys.indexOf(key);
      
      if (index === 0) return 'Competitor 1';
      if (index === 1) return 'Competitor 2';
      return key; // Fallback for unexpected keys
  };
  
  const getFillColor = (key: string) => {
      if (key === yourCompany) return COLORS['Your Company'];
      
      const competitorKeys = seriesKeys.filter(k => k !== yourCompany);
      const index = competitorKeys.indexOf(key);
      
      if (index === 0) return COLORS['Competitor 1'];
      if (index === 1) return COLORS['Competitor 2'];
      return '#94a3b8'; // Default gray for others
  };

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          // Reduced margins for better fit on smaller screens
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
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
          
          {seriesKeys.map((key) => (
            <Bar 
              key={key}
              dataKey={key} 
              name={getDisplayName(key)} 
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