
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SentimentChartProps {
  data: {
    positive_articles: number;
    negative_articles: number;
    neutral_articles: number;
  };
}

const COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#64748b',
};

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData = [
    { name: 'Positive', value: data.positive_articles, color: COLORS.positive },
    { name: 'Negative', value: data.negative_articles, color: COLORS.negative },
    { name: 'Neutral', value: data.neutral_articles, color: COLORS.neutral },
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value, 'Articles']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
