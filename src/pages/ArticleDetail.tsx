
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Calendar, Globe, FileText } from 'lucide-react';
import { api } from '@/lib/api';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => api.getArticle(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <p className="text-slate-600 mb-6">The article you're looking for doesn't exist or couldn't be loaded.</p>
        <Link to="/articles">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  const getSentimentColor = (compound: number) => {
    if (compound > 0.1) return 'bg-green-100 text-green-800';
    if (compound < -0.1) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const getSentimentLabel = (compound: number) => {
    if (compound > 0.1) return 'Positive';
    if (compound < -0.1) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/articles">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-4 w-4" />
          View Original Article
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl leading-tight">{article.title}</CardTitle>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {article.domain}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {article.publish_date}
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {article.word_count} words
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Article Content */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Content</h3>
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              {article.content}
            </div>
          </div>

          {/* Sentiment Analysis */}
          {article.sentiment && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Sentiment Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge className={getSentimentColor(article.sentiment.compound)}>
                    {getSentimentLabel(article.sentiment.compound)}
                  </Badge>
                  <div className="text-sm text-slate-600 mt-1">
                    {article.sentiment.compound.toFixed(3)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Positive</div>
                  <div className="font-medium text-green-600">
                    {(article.sentiment.pos * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Neutral</div>
                  <div className="font-medium text-slate-600">
                    {(article.sentiment.neu * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Negative</div>
                  <div className="font-medium text-red-600">
                    {(article.sentiment.neg * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Problems Identified */}
          {article.problems && article.problems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Identified Problems</h3>
              <div className="flex flex-wrap gap-2">
                {article.problems.map((problem, index) => (
                  <Badge key={index} variant="secondary">
                    {problem}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* News Score */}
          <div>
            <h3 className="text-lg font-semibold mb-3">News Score</h3>
            <div className="text-2xl font-bold text-blue-600">
              {article.news_score?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-sm text-slate-600">
              Relevance score for SME news analysis
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
