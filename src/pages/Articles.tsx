
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArticleLink } from '@/components/ui/article-link';
import { api } from '@/lib/api';
import { Search, ExternalLink } from 'lucide-react';
import { Article } from '@/types/api';

export default function Articles() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', page, selectedDomain],
    queryFn: () => api.getArticles(page, 20, selectedDomain || undefined),
  });

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => api.searchArticles(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
  });

  const displayedArticles = searchQuery.length > 2 ? searchResults?.articles : articlesData?.articles;

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'bg-green-100 text-green-800';
    if (score < -0.1) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const formatDate = (dateStr: string) => {
    try {
      const [date, time] = dateStr.split(' - ');
      const [day, month, year] = date.split('/');
      return new Date(`${year}-${month}-${day}T${time}`).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Articles Management</h1>
        <p className="text-slate-600 mt-2">
          Browse, search, and analyze all news articles in the dataset
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains</option>
              {stats?.top_domains && Object.keys(stats.top_domains).map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedArticles?.map((article: Article) => (
          <Card key={article._id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <ArticleLink 
                  articleId={article._id}
                  className="font-medium text-slate-900 line-clamp-2 block flex-1"
                >
                  {article.title}
                </ArticleLink>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-600 line-clamp-3">
                  {article.content}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{article.domain}</Badge>
                  {article.news_score !== undefined && article.news_score !== null && (
                    <Badge 
                      className={getSentimentColor(article.news_score)}
                    >
                      Score: {article.news_score.toFixed(2)}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>{formatDate(article.publish_date)}</span>
                  <span>{article.word_count} words</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {articlesData?.pagination && !searchQuery && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-slate-600">
            Page {page} of {articlesData.pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= articlesData.pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
