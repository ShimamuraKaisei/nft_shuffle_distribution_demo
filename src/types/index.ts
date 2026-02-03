export interface LineupItem {
  id: number;
  name: string;
  image: string;
  rarity: 'SSR' | 'SR' | 'R' | 'N';
  probability: number;
}

export interface ShuffleData {
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  showProbability: boolean;
  showShareButton: boolean;
  externalLink: string;
  remainingCount: number;
  maxCount: number;
  lineup: LineupItem[];
}

export interface ShuffleResult {
  id: number;
  name: string;
  image: string;
  rarity: 'SSR' | 'SR' | 'R' | 'N';
}
