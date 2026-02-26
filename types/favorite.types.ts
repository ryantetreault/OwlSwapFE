import { Listing } from './listing.types';

export interface Favorite {
  favoriteId: number;
  userId: number;
  itemId: number;
  item?: Listing;
}

export interface PaginatedFavoritesResponse {
  content: Listing[];  // Backend returns full item DTOs
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
