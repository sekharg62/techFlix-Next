import apiClient from "@/lib/api/apiClient";
import { CategorySummaryItem, CategoriesSummaryApiResponse } from "@/types/category";

/**
 * Service to fetch categories summary with product counts
 */
export const categoryService = {
  async getCategoriesSummary(): Promise<CategorySummaryItem[]> {
    try {
      const response = await apiClient.get<CategoriesSummaryApiResponse>("/api/categories/summary");
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback try /api/categories/counts if /summary is unavailable
      try {
        const fallbackResponse = await apiClient.get<CategoriesSummaryApiResponse>("/api/categories/counts");
        if (fallbackResponse.data && fallbackResponse.data.success && Array.isArray(fallbackResponse.data.data)) {
          return fallbackResponse.data.data;
        }
      } catch {
        // Handled by returning empty array to let component use static fallback
      }
    }

    return [];
  },
};
