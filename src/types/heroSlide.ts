export interface HeroSlideItem {
  id: string;
  order: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  linkUrl?: string;
  buttonText?: string;
}

export interface HeroSlidesApiResponse {
  success: boolean;
  count?: number;
  data: HeroSlideItem[];
  message?: string;
}
