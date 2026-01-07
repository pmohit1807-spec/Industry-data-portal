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
import { CardContent } from '@/components/ui/card';
import { ChartDataPoint } from '@/utils/dataTransformation';

interface HPTrendAnalysisChartProps {
  data: ChartDataPoint[]; // Data points where keys are HP ranges
  seriesKeys: string[]; // HP range names
}

// Color palette for HP ranges
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

const HPTrendAnalysisChart: React.FC<HPTrendAnalysisChartProps> = ({ data, seriesKeys }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No HP trend analysis data available.
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
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
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              name={key}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default HPTrendAnalysisChart;