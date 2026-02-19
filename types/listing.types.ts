// Backend actual response from ItemDto.java and ItemImageDto.java
export interface ItemImage {
  imageId: number;
  itemId: number;
  image_name: string; // Backend uses snake_case for image fields
  image_type: string;
  image_date: number[]; // byte array from backend
}

export interface Listing {
  itemId: number;
  name: string;
  description: string;
  price: number;
  userId: number;
  category: string; // Category name as string
  releaseDate: string;
  available: boolean;
  location?: string;
  locationId: number | null;
  itemType: string; // 'product', 'service', 'request'
  images: ItemImage[];
}

// Backend actual response from CategoryDto.java
export interface Category {
  categoryId: number;
  name: string;
}

// Backend returns Page<ItemDto> with Spring pagination structure
export interface PaginatedListingsResponse {
  content: Listing[]; // Backend uses 'content' not 'items'
  totalPages: number;
  totalElements: number;
  number: number; // Current page number (0-indexed)
  size: number;
}

export interface ListingFilters {
  keyword?: string; // Backend expects 'keyword' not 'search'
  category?: string; // Backend expects category name as string
  page?: number;
  size?: number;
}
