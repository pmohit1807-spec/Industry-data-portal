import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '@/utils/dataTransformation';
import { CardContent } from '@/components/ui/card';

interface SalesLineChartProps {
  data: ChartDataPoint[];
  seriesKeys: string[]; // e.g., ['Mahindra', 'John Deere', ...]
  dimensionName: 'company' | 'state';
}

// Simple color palette for up to 5 series
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const SalesLineChart: React.FC<SalesLineChartProps> = ({ data, seriesKeys, dimensionName }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No data available to display chart based on current filters.
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
          <YAxis stroke="hsl(var(--foreground))" tickFormatter={(value) => value.toLocaleString()} />
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
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              name={key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default SalesLineChart;