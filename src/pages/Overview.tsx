
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SentimentChart } from '@/components/charts/SentimentChart';
import { DomainsChart } from '@/components/charts/DomainsChart';
import { api } from '@/lib/api';
import { FileText, Calendar, TrendingUp, BarChart } from 'lucide-react';

export default function Overview() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
  });

  const { data: sentiment, isLoading: sentimentLoading } = useQuery({
    queryKey: ['sentiment'],
    queryFn: api.getSentiment,
  });

  if (statsLoading || sentimentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600 mt-2">
          Comprehensive analysis of SME news articles and trends
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Articles"
          value={stats?.total_articles?.toLocaleString() || '0'}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Unique Domains"
          value={stats?.unique_domains || '0'}
          icon={BarChart}
          color="green"
        />
        <StatsCard
          title="Avg Word Count"
          value={Math.round(stats?.avg_word_count || 0)}
          icon={TrendingUp}
          color="orange"
        />
        <StatsCard
          title="Date Range"
          value={`${stats?.date_range?.earliest || ''} - ${stats?.date_range?.latest || ''}`}
          icon={Calendar}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {sentiment && (
              <SentimentChart data={sentiment.overall_sentiment} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top News Domains</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.top_domains && (
              <DomainsChart data={stats.top_domains} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {sentiment && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Average Sentiment:</span>
                  <span className="font-medium">
                    {sentiment.overall_sentiment.mean_compound.toFixed(3)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Positive</span>
                    <span>{sentiment.overall_sentiment.positive_articles}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Neutral</span>
                    <span>{sentiment.overall_sentiment.neutral_articles}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Negative</span>
                    <span>{sentiment.overall_sentiment.negative_articles}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Avg News Score:</span>
                <span className="font-medium">
                  {stats?.avg_news_score?.toFixed(3) || '0'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats?.avg_news_score || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">From:</span>
                <span className="font-medium">{stats?.date_range?.earliest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">To:</span>
                <span className="font-medium">{stats?.date_range?.latest}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
