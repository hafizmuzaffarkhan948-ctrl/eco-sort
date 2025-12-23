
export enum BinCategory {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
  GREY = 'GREY'
}

export interface WasteAnalysis {
  category: BinCategory;
  binNameEn: string;
  binNameUr: string;
  explanationEn: string;
  explanationUr: string;
  identifiedItem: string;
}

export interface BinInfo {
  category: BinCategory;
  colorClass: string;
  bgClass: string;
  textClass: string;
  labelEn: string;
  labelUr: string;
  itemsEn: string[];
}
