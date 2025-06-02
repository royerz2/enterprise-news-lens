export interface Article {
  _id: string;
  url: string;
  title: string;
  content: string;
  domain: string;
  publish_date: string | null;
  word_count: number;
  is_sme_related: boolean;
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
  sme_related_sentiment: {
    mean_compound: number;
    positive_articles: number;
    negative_articles: number;
    neutral_articles: number;
  };
  articles: Array<{
    article_id: string;
    title: string;
    domain: string;
    sentiment: {
      compound: number;
      pos: number;
      neu: number;
      neg: number;
    };
    is_sme_related: boolean;
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
  sme_related_stats: {
    total_sme_related: number;
    percentage_sme_related: number;
  };
}

export interface ProblemData {
  problem_summary: {
    all_articles: Record<string, number>;
    sme_related: Record<string, number>;
  };
  problem_articles: Record<string, Array<{
    article_id: string;
    title: string;
    url: string;
    domain: string;
    publish_date: string | null;
    is_sme_related: boolean;
  }>>;
  total_articles_with_problems: number;
  total_sme_articles_with_problems: number;
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
    is_sme_related?: boolean;
  }>;
  edges: Array<{
    source: string;
    target: string;
    connection_type: string;
  }>;
}

export interface NetworkAnalysisData {
  average_clustering_coefficient: number;
  degree_assortativity_coefficient: number | null;
  centrality_measures_summary: {
    article_nodes: {
      degree_centrality: { mean: number; max: number };
      betweenness_centrality: { mean: number; max: number };
      closeness_centrality: { mean: number; max: number };
    };
    problem_nodes: {
      degree_centrality: { mean: number; max: number };
      betweenness_centrality: { mean: number; max: number };
      closeness_centrality: { mean: number; max: number };
    };
  };
  advanced_analysis: {
    communities: string[][];
    pagerank_top_10: [string, number][];
    constraint_top_10_lowest: [string, number][];
    effective_size_top_10: [string, number][];
  };
}

export interface AnalysisData {
  article_id: string;
  overall_sentiment: {
    score: number;
    label: string;
    confidence: number;
  };
  entity_sentiment: Record<string, {
    score: number;
    label: string;
    confidence: number;
  }>;
  emotional_tone: {
    primary_emotion: string;
    emotion_scores: Record<string, number>;
  };
  sme_implications: {
    relevance_score: number;
    key_implications: string[];
    affected_areas: string[];
    urgency_level: string;
  };
  summary: string;
  key_topics: string[];
  analysis_timestamp: string;
}
