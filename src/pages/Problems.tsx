
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProblemData } from '@/types/api';

const PROBLEM_COLORS = {
  financing: '#3b82f6',
  workforce: '#10b981',
  regulation: '#f59e0b',
  technology: '#8b5cf6',
  'market competition': '#ef4444',
  'supply chain': '#06b6d4',
  sustainability: '#84cc16',
  innovation: '#f97316',
};

export default function Problems() {
  const { data: problems, isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: api.getProblems,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!problems) return null;

  const typedProblems = problems as ProblemData;

  const chartData = Object.entries(typedProblems.problem_summary).map(([problem, count]) => ({
    problem: problem.charAt(0).toUpperCase() + problem.slice(1),
    count,
    color: PROBLEM_COLORS[problem as keyof typeof PROBLEM_COLORS] || '#64748b',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">SME Problem Analysis</h1>
        <p className="text-slate-600 mt-2">
          Identify and analyze the key challenges facing small and medium enterprises
        </p>
      </div>

      {/* Problem Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(typedProblems.problem_summary).map(([problem, count]) => (
          <Card key={problem} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <div className="text-sm text-slate-600 capitalize">{problem}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Problem Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="problem" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Problem Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(typedProblems.problem_articles).map(([problem, articles]) => {
          const typedArticles = articles as Array<{
            article_id: string;
            title: string;
            url: string;
          }>;
          
          return (
            <Card key={problem}>
              <CardHeader>
                <CardTitle className="capitalize">{problem} ({typedArticles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {typedArticles.slice(0, 5).map((article) => (
                    <div key={article.article_id} className="border-l-4 border-blue-500 pl-3">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                        {article.title}
                      </h4>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Read article →
                      </a>
                    </div>
                  ))}
                  {typedArticles.length > 5 && (
                    <div className="text-xs text-slate-500 text-center">
                      ... and {typedArticles.length - 5} more articles
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
