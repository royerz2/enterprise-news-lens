
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SentimentChart } from '@/components/charts/SentimentChart';
import { ArticleLink } from '@/components/ui/article-link';
import { api } from '@/lib/api';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

export default function Sentiment() {
  const { data: sentiment, isLoading } = useQuery({
    queryKey: ['sentiment'],
    queryFn: api.getSentiment,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sentiment) return null;

  const getSentimentLabel = (compound: number) => {
    if (compound > 0.1) return 'Positive';
    if (compound < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (compound: number) => {
    if (compound > 0.1) return 'text-green-600 bg-green-50';
    if (compound < -0.1) return 'text-red-600 bg-red-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sentiment Analysis</h1>
        <p className="text-slate-600 mt-2">
          Explore the emotional tone and sentiment distribution across all articles
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Average Sentiment"
          value={sentiment.overall_sentiment.mean_compound.toFixed(3)}
          icon={Heart}
          color="blue"
        />
        <StatsCard
          title="Positive Articles"
          value={sentiment.overall_sentiment.positive_articles}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Negative Articles"
          value={sentiment.overall_sentiment.negative_articles}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Neutral Articles"
          value={sentiment.overall_sentiment.neutral_articles}
          icon={Heart}
          color="orange"
        />
      </div>

      {/* Sentiment Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <SentimentChart data={sentiment.overall_sentiment} />
        </CardContent>
      </Card>

      {/* Articles by Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle>Articles by Sentiment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sentiment.articles?.map((article) => (
              <div 
                key={article.article_id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <ArticleLink 
                      articleId={article.article_id}
                      className="font-medium text-slate-900 line-clamp-2 block"
                    >
                      {article.title}
                    </ArticleLink>
                    <div className="mt-2 flex gap-2 text-xs">
                      <span className="text-slate-500">
                        Compound: {article.sentiment.compound.toFixed(3)}
                      </span>
                      <span className="text-green-600">
                        Pos: {article.sentiment.pos.toFixed(3)}
                      </span>
                      <span className="text-slate-500">
                        Neu: {article.sentiment.neu.toFixed(3)}
                      </span>
                      <span className="text-red-600">
                        Neg: {article.sentiment.neg.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment.compound)}`}>
                    {getSentimentLabel(article.sentiment.compound)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
