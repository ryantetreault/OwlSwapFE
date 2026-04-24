// Backend actual response from ItemDto.java and ItemImageDto.java
export interface ItemImage {
  imageId: number;
  itemId: number;
  image_name: string; // Backend uses snake_case for image fields
  image_type: string;
  image_date: number[] | string; // byte array from backend (may be base64 string via Jackson)
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
  listingStatus?: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  location?: string;
  locationId: number | null;
  itemType: string; // 'product', 'service', 'request'
  images: ItemImage[];
  // product-specific
  brand?: string;
  quantity?: number;
  // service-specific
  durationMinutes?: number;
  // request-specific
  deadline?: string;
}

// Backend actual response from CategoryDto.java
export interface Category {
  categoryId: number;
  name: string;
}

// Backend actual response from LocationDto.java (new expanded model)
export interface Location {
  locationId: number;
  name: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  locationType?: string;
  verified?: boolean;
  preset?: boolean;
  active?: boolean;
}

export interface CreateSellerLocationRequest {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export type UpdateSellerLocationRequest = CreateSellerLocationRequest;

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
