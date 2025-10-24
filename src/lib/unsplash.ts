// Unsplash API service for high-quality images
export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
  color: string;
  likes: number;
}

export interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export class UnsplashService {
  private accessKey: string;
  private baseUrl = 'https://api.unsplash.com';

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    return await response.json();
  }

  async searchPhotos(
    query: string,
    page: number = 1,
    perPage: number = 20,
    orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
  ): Promise<UnsplashSearchResult> {
    return this.makeRequest('/search/photos', {
      query,
      page: page.toString(),
      per_page: perPage.toString(),
      orientation,
    });
  }

  async getInteriorDesignPhotos(
    roomType: string,
    style: string = 'modern',
    page: number = 1,
    perPage: number = 20
  ): Promise<UnsplashSearchResult> {
    const query = `${roomType} interior design ${style}`;
    return this.searchPhotos(query, page, perPage, 'landscape');
  }

  async getProductPhotos(
    productType: string,
    style: string = 'minimalist',
    page: number = 1,
    perPage: number = 20
  ): Promise<UnsplashSearchResult> {
    const query = `${productType} furniture ${style}`;
    return this.searchPhotos(query, page, perPage, 'squarish');
  }

  async getRandomPhotos(
    query: string,
    count: number = 10,
    orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
  ): Promise<UnsplashPhoto[]> {
    const result = await this.makeRequest('/photos/random', {
      query,
      count: count.toString(),
      orientation,
    });

    return Array.isArray(result) ? result : [result];
  }

  async getPhotoById(id: string): Promise<UnsplashPhoto> {
    return this.makeRequest(`/photos/${id}`);
  }

  async getCollectionPhotos(
    collectionId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<UnsplashPhoto[]> {
    return this.makeRequest(`/collections/${collectionId}/photos`, {
      page: page.toString(),
      per_page: perPage.toString(),
    });
  }

  // Predefined collections for interior design
  async getInteriorDesignCollection(): Promise<UnsplashPhoto[]> {
    // This would use a specific collection ID for interior design
    // For now, we'll use a search approach
    return this.getRandomPhotos('interior design modern', 20, 'landscape');
  }

  async getFurnitureCollection(): Promise<UnsplashPhoto[]> {
    return this.getRandomPhotos('furniture modern', 20, 'squarish');
  }

  async getHomeDecorCollection(): Promise<UnsplashPhoto[]> {
    return this.getRandomPhotos('home decor minimalist', 20, 'squarish');
  }

  // Utility method to get optimized image URL
  getOptimizedImageUrl(photo: UnsplashPhoto, size: 'thumb' | 'small' | 'regular' | 'full' = 'regular'): string {
    return photo.urls[size];
  }

  // Utility method to get image with specific dimensions
  getImageWithDimensions(photo: UnsplashPhoto, width: number, height: number): string {
    const baseUrl = photo.urls.raw;
    return `${baseUrl}&w=${width}&h=${height}&fit=crop&crop=center`;
  }
}

// Create a singleton instance
export const unsplashService = new UnsplashService(import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '');
