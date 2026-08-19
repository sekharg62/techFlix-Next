import apiClient from "@/lib/api/apiClient";
import { HeroSlideItem, HeroSlidesApiResponse } from "@/types/heroSlide";

/**
 * Service to fetch all hero slides sorted by order ascending (1, 2, 3...)
 */
export const heroSlideService = {
  async getAllHeroSlides(): Promise<HeroSlideItem[]> {
    const response = await apiClient.get<HeroSlidesApiResponse>("/api/hero-slides");
    
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      // Sort slides by order in ascending order
      return [...response.data.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    
    return [];
  },
};
