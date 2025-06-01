
export interface Article {
  _id: string;
  url: string;
  title: string;
  content: string;
  domain: string;
  publish_date: string;
  word_count: number;
  news_score: number;
}

export interface PaginatedArticles {
  articles: Article[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}

export interface SentimentData {
  overall_sentiment: {
    mean_compound: number;
    positive_articles: number;
    negative_articles: number;
    neutral_articles: number;
  };
  articles: Array<{
    article_id: string;
    title: string;
    sentiment: {
      compound: number;
      pos: number;
      neu: number;
      neg: number;
    };
  }>;
}

export interface ClusterData {
  n_clusters: number;
  clusters: Record<string, {
    articles: Array<{
      article_id: string;
      title: string;
      url: string;
    }>;
    top_terms: string[];
    size: number;
  }>;
}

export interface StatsData {
  total_articles: number;
  unique_domains: number;
  date_range: {
    earliest: string;
    latest: string;
  };
  top_domains: Record<string, number>;
  avg_word_count: number;
  avg_news_score: number;
}

export interface ProblemData {
  problem_summary: Record<string, number>;
  problem_articles: Record<string, Array<{
    article_id: string;
    title: string;
    url: string;
  }>>;
}

export interface NetworkData {
  network_stats: {
    num_nodes: number;
    num_edges: number;
    density: number;
    connected_components: number;
  };
  nodes: Array<{
    id: string;
    type: string;
    title?: string;
    domain?: string;
    name?: string;
    degree?: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
    connection_type: string;
  }>;
}
