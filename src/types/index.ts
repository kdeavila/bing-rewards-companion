export interface TrendingTopic {
  id: string;
  title: string;
  url?: string;
}

export interface SearchState {
  dailyCount: number;
  dailyGoal: number;
  cooldown: number;
  isAutoSearching: boolean;
  autoSearchIndex: number;
}
