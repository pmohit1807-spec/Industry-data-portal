export interface TractorSale {
  month: string;
  state: string;
  company: string;
  hp_range: string;
  units_sold: number;
}

export const mockTractorData: TractorSale[] = [
  { month: "Jan 2024", state: "Maharashtra", company: "Mahindra", hp_range: "30-40 HP", units_sold: 120 },
  { month: "Jan 2024", state: "Maharashtra", company: "Mahindra", hp_range: "40-50 HP", units_sold: 80 },
  { month: "Jan 2024", state: "Maharashtra", company: "John Deere", hp_range: "30-40 HP", units_sold: 60 },
  { month: "Jan 2024", state: "Maharashtra", company: "John Deere", hp_range: "50+ HP", units_sold: 45 },
  { month: "Jan 2024", state: "Punjab", company: "Sonalika", hp_range: "40-50 HP", units_sold: 150 },
  { month: "Jan 2024", state: "Punjab", company: "Mahindra", hp_range: "30-40 HP", units_sold: 90 },
  { month: "Feb 2024", state: "Maharashtra", company: "Mahindra", hp_range: "30-40 HP", units_sold: 130 },
  { month: "Feb 2024", state: "Punjab", company: "Sonalika", hp_range: "40-50 HP", units_sold: 160 },
  { month: "Feb 2024", state: "Tamil Nadu", company: "John Deere", hp_range: "30-40 HP", units_sold: 70 },
  { month: "Feb 2024", state: "Tamil Nadu", company: "Mahindra", hp_range: "50+ HP", units_sold: 55 },
];

export const uniqueStates = Array.from(new Set(mockTractorData.map(d => d.state)));
export const uniqueCompanies = Array.from(new Set(mockTractorData.map(d => d.company)));
export const uniqueHPRanges = Array.from(new Set(mockTractorData.map(d => d.hp_range)));