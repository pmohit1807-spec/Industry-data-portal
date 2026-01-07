import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CardContent } from '@/components/ui/card';

interface SnapshotDataPoint {
  company: string;
  sales: number;
  share: number; // 0-100%
}

interface CurrentMonthSnapshotProps {
  data: SnapshotDataPoint[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-card border border-border rounded-md shadow-lg text-sm">
        <p className="font-bold">{data.company}</p>
        <p>Sales: {data.sales.toLocaleString()}</p>
        <p>Share: {data.share.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const CurrentMonthSnapshot: React.FC<CurrentMonthSnapshotProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[350px] flex items-center justify-center">
        No data available for the current month snapshot.
      </CardContent>
    );
  }
  
  // The month information is handled by the parent component (ExecutiveOverview)

  return (
    <CardContent className="p-6 h-[350px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="sales"
            nameKey="company"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {/* Updated Legend to horizontal layout at the bottom */}
          <Legend layout="horizontal" align="center" verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default CurrentMonthSnapshot;