export interface BotStatus {
  isRunning: boolean;
  lastUpdate: string;
  portfolioValue: number;
  recentTrades: Trade[];
  recentTweets: Tweet[];
}

export interface Trade {
  timestamp: string;
  type: 'buy' | 'sell';
  token: string;
  amount: string;
  price: string;
  txHash: string;
}

export interface Tweet {
  timestamp: string;
  content: string;
  id: string;
  type: 'tweet' | 'reply';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 