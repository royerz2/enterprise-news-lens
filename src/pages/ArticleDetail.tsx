
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Calendar, Globe, FileText, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => api.getArticle(id!),
    enabled: !!id,
  });

  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => api.getAnalysis(id!),
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

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'bg-green-100 text-green-800';
    if (score < -0.1) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.1) return 'Positive';
    if (score < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
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
            {article.is_sme_related && (
              <Badge className="bg-blue-100 text-blue-800">
                SME Related
              </Badge>
            )}
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

          {/* Advanced Analysis */}
          {analysis && !analysisLoading && (
            <>
              {/* Analysis Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis Summary
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">{analysis.summary}</p>
                </div>
              </div>

              {/* Overall Sentiment */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Overall Sentiment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Badge className={getSentimentColor(analysis.overall_sentiment.score)}>
                      {analysis.overall_sentiment.label}
                    </Badge>
                    <div className="text-sm text-slate-600 mt-1">
                      Score: {analysis.overall_sentiment.score.toFixed(3)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Confidence: {(analysis.overall_sentiment.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Emotional Tone</div>
                    <div className="font-medium text-purple-600">
                      {analysis.emotional_tone.primary_emotion}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">SME Relevance</div>
                    <div className="font-medium text-blue-600">
                      {(analysis.sme_implications.relevance_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Topics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.key_topics.map((topic, index) => (
                    <Badge key={index} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* SME Implications */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  SME Implications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm text-slate-600">Urgency Level:</span>
                      <Badge className={getUrgencyColor(analysis.sme_implications.urgency_level)} variant="secondary">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {analysis.sme_implications.urgency_level}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Implications:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {analysis.sme_implications.key_implications.map((implication, index) => (
                        <li key={index}>{implication}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Affected Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.sme_implications.affected_areas.map((area, index) => (
                        <Badge key={index} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Entity Sentiment */}
              {Object.keys(analysis.entity_sentiment).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Entity Sentiment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(analysis.entity_sentiment).map(([entity, sentiment]) => (
                      <div key={entity} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">{entity}</div>
                        <Badge className={getSentimentColor(sentiment.score)} variant="secondary">
                          {sentiment.label}
                        </Badge>
                        <div className="text-xs text-slate-500 mt-1">
                          {(sentiment.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {analysisLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600">Loading advanced analysis...</span>
            </div>
          )}

          {/* Legacy Sentiment Analysis (fallback if advanced analysis not available) */}
          {!analysis && !analysisLoading && article.sentiment && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Sentiment Analysis</h3>
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
        </CardContent>
      </Card>
    </div>
  );
}
