
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ClusterData } from '@/types/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export default function Clusters() {
  const [nClusters, setNClusters] = useState(8);
  
  const { data: clusters, isLoading, refetch } = useQuery({
    queryKey: ['clusters', nClusters],
    queryFn: () => api.getClusters(nClusters),
  });

  const handleClusterChange = (newValue: number) => {
    setNClusters(newValue);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clusters) return null;

  const typedClusters = clusters as ClusterData;

  const clusterSizeData = Object.entries(typedClusters.clusters).map(([id, cluster]) => ({
    cluster: `Cluster ${id}`,
    size: cluster.size,
    topTerm: cluster.top_terms[0] || 'Unknown',
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Article Clustering</h1>
          <p className="text-slate-600 mt-2">
            Discover thematic groups and patterns in SME news articles
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Number of clusters:</span>
          <div className="flex gap-1">
            {[4, 6, 8, 10, 12].map((value) => (
              <Button
                key={value}
                variant={nClusters === value ? "default" : "outline"}
                size="sm"
                onClick={() => handleClusterChange(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Cluster Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{typedClusters.n_clusters}</div>
              <div className="text-sm text-slate-600">Total Clusters</div>
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(typedClusters.clusters).slice(0, 3).map(([id, cluster]) => (
          <Card key={id}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{cluster.size}</div>
                <div className="text-sm text-slate-600 capitalize">
                  {cluster.top_terms.slice(0, 2).join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cluster Sizes Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cluster Sizes Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clusterSizeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="cluster" 
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
                <Bar dataKey="size" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cluster Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(typedClusters.clusters).map(([id, cluster]) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Cluster {id}</span>
                <span className="text-sm font-normal text-slate-600">
                  {cluster.size} articles
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Top Terms */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {cluster.top_terms.slice(0, 6).map((term, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Articles */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Sample Articles</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cluster.articles.slice(0, 3).map((article) => (
                      <div key={article.article_id} className="border-l-4 border-blue-500 pl-3">
                        <h5 className="text-sm font-medium text-slate-900 line-clamp-2">
                          {article.title}
                        </h5>
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
                    {cluster.articles.length > 3 && (
                      <div className="text-xs text-slate-500 text-center">
                        ... and {cluster.articles.length - 3} more articles
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
