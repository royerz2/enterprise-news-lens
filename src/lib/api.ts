
const API_BASE_URL = 'http://localhost:5001';

export const api = {
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getArticles(page = 1, perPage = 20, domain?: string, isSmeRelated?: boolean) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (domain) params.append('domain', domain);
    if (isSmeRelated !== undefined) params.append('is_sme_related', isSmeRelated.toString());
    
    const response = await fetch(`${API_BASE_URL}/articles?${params}`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  async getArticle(id: string) {
    const response = await fetch(`${API_BASE_URL}/article/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  },

  async searchArticles(query: string, isSmeRelated?: boolean) {
    const params = new URLSearchParams({ q: query });
    if (isSmeRelated !== undefined) params.append('is_sme_related', isSmeRelated.toString());
    
    const response = await fetch(`${API_BASE_URL}/search?${params}`);
    if (!response.ok) throw new Error('Failed to search articles');
    return response.json();
  },

  async getSentiment() {
    const response = await fetch(`${API_BASE_URL}/sentiment`);
    if (!response.ok) throw new Error('Failed to fetch sentiment data');
    return response.json();
  },

  async getClusters(nClusters = 8) {
    const params = new URLSearchParams({ n_clusters: nClusters.toString() });
    const response = await fetch(`${API_BASE_URL}/clusters?${params}`);
    if (!response.ok) throw new Error('Failed to fetch clusters');
    return response.json();
  },

  async getProblems() {
    const response = await fetch(`${API_BASE_URL}/problems`);
    if (!response.ok) throw new Error('Failed to fetch problems');
    return response.json();
  },

  async getNetwork() {
    const response = await fetch(`${API_BASE_URL}/network`);
    if (!response.ok) throw new Error('Failed to fetch network data');
    return response.json();
  },

  async getNetworkAnalysis() {
    const response = await fetch(`${API_BASE_URL}/network_analysis`);
    if (!response.ok) throw new Error('Failed to fetch network analysis');
    return response.json();
  },
};
