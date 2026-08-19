export interface CategorySummaryItem {
  name: string;
  slug: string;
  totalProducts: number;
}

export interface CategoriesSummaryApiResponse {
  success: boolean;
  count?: number;
  data: CategorySummaryItem[];
  message?: string;
}
