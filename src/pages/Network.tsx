
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { NetworkData, NetworkAnalysisData } from '@/types/api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const NODE_COLORS = {
  article: '#3b82f6',
  problem: '#ef4444',
};

export default function Network() {
  const { data: network, isLoading: networkLoading } = useQuery({
    queryKey: ['network'],
    queryFn: api.getNetwork,
  });

  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['network-analysis'],
    queryFn: api.getNetworkAnalysis,
  });

  if (networkLoading || analysisLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!network) return null;

  const typedNetwork = network as NetworkData;
  const typedAnalysis = analysis as NetworkAnalysisData | undefined;

  // Prepare data for visualization
  const networkVisualizationData = typedNetwork.nodes.map((node, index) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: node.degree || 5,
    type: node.type,
    label: node.type === 'article' ? node.title?.substring(0, 30) + '...' : node.name,
    id: node.id,
    isSme: node.is_sme_related,
  }));

  const connectionTypes = [...new Set(typedNetwork.edges.map(edge => edge.connection_type))];
  const nodeTypes = [...new Set(typedNetwork.nodes.map(node => node.type))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Network Analysis</h1>
        <p className="text-slate-600 mt-2">
          Explore relationships between articles and problem categories
        </p>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{typedNetwork.network_stats.num_nodes}</div>
              <div className="text-sm text-slate-600">Nodes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{typedNetwork.network_stats.num_edges}</div>
              <div className="text-sm text-slate-600">Connections</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {(typedNetwork.network_stats.density * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600">Density</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {typedNetwork.network_stats.connected_components}
              </div>
              <div className="text-sm text-slate-600">Components</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Network Analysis */}
      {typedAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Clustering Coefficient:</span>
                  <span className="font-medium">{typedAnalysis.average_clustering_coefficient.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Assortativity:</span>
                  <span className="font-medium">
                    {typedAnalysis.degree_assortativity_coefficient?.toFixed(3) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Communities:</span>
                  <span className="font-medium">{typedAnalysis.advanced_analysis.communities.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top PageRank Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {typedAnalysis.advanced_analysis.pagerank_top_10.slice(0, 5).map(([nodeId, score], index) => {
                  const node = typedNetwork.nodes.find(n => n.id === nodeId);
                  return (
                    <div key={nodeId} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">#{index + 1}</span>
                        <span className="font-medium truncate">
                          {node?.type === 'article' ? node.title?.substring(0, 25) + '...' : node?.name || nodeId}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {node?.type}
                        </Badge>
                      </div>
                      <span className="text-blue-600 font-medium">{score.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Network Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Network Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                data={networkVisualizationData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value, name, props) => [
                    `${props.payload.label} (${props.payload.type})${props.payload.isSme ? ' - SME' : ''}`,
                    'Node'
                  ]}
                />
                <Scatter dataKey="size" fill="#8884d8">
                  {networkVisualizationData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={NODE_COLORS[entry.type as keyof typeof NODE_COLORS]} 
                      fillOpacity={entry.isSme ? 1 : 0.6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {nodeTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: NODE_COLORS[type as keyof typeof NODE_COLORS] }}
                />
                <span className="text-sm text-slate-600 capitalize">{type}s</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400 opacity-60" />
              <span className="text-sm text-slate-600">Non-SME</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Types and Centrality Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {connectionTypes.map((type) => {
                const count = typedNetwork.edges.filter(edge => edge.connection_type === type).length;
                return (
                  <div key={type} className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-slate-900">{count}</div>
                    <div className="text-sm text-slate-600 capitalize">{type.replace('_', ' ')}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {typedAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>Centrality Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Article Nodes</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Avg Degree Centrality:</span>
                      <span>{typedAnalysis.centrality_measures_summary.article_nodes.degree_centrality.mean.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Closeness:</span>
                      <span>{typedAnalysis.centrality_measures_summary.article_nodes.closeness_centrality.max.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Problem Nodes</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Avg Degree Centrality:</span>
                      <span>{typedAnalysis.centrality_measures_summary.problem_nodes.degree_centrality.mean.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Closeness:</span>
                      <span>{typedAnalysis.centrality_measures_summary.problem_nodes.closeness_centrality.max.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Most Connected Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Connected Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {typedNetwork.nodes
                .filter(node => node.type === 'article')
                .sort((a, b) => (b.degree || 0) - (a.degree || 0))
                .slice(0, 5)
                .map((node) => (
                  <div key={node.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                        {node.title || 'Untitled Article'}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-slate-500">{node.domain}</span>
                        {node.is_sme_related && (
                          <Badge variant="outline" className="text-xs">SME</Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 ml-2">
                      {node.degree} connections
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {typedNetwork.nodes
                .filter(node => node.type === 'problem')
                .sort((a, b) => (b.degree || 0) - (a.degree || 0))
                .map((node) => (
                  <div key={node.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-900 capitalize">
                      {node.name?.replace('_', ' ') || node.id}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {node.degree} articles
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
