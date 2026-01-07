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
import { ComparisonDataPoint } from '@/utils/dataTransformation';

interface CompanyComparisonChartProps {
  data: ComparisonDataPoint[]; // Changed type
  seriesKeys: string[]; // Company names
  xAxisKey: string; // e.g., 'hp_range' or 'state'
  title: string;
}

// Color palette for competitors (same as MarketShareChart)
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

const CompanyComparisonChart: React.FC<CompanyComparisonChartProps> = ({ data, seriesKeys, xAxisKey, title }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No data available to display {title}.
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          // Reduced margins for better fit on smaller screens
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="hsl(var(--foreground))" 
            // Rotate labels if they are long (e.g., state names)
            angle={xAxisKey === 'state' ? -15 : 0} 
            textAnchor={xAxisKey === 'state' ? "end" : "middle"} 
            height={xAxisKey === 'state' ? 50 : 30}
          />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            tickFormatter={(value) => value.toLocaleString()}
            // Removed label for space saving on mobile
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
              stackId="a" // Stacked bar chart
              fill={COLORS[index % COLORS.length]}
              name={key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default CompanyComparisonChart;