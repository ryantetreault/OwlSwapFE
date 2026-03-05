export interface ApiError {
  message: string;
  status: number;
  error?: string;                        // Backend error code (e.g., "VALIDATION_FAILED")
  path?: string;                         // Request path
  timestamp?: string;                    // ISO timestamp
  errors?: Record<string, string[]>;     // Keep for backwards compatibility
  fieldErrors?: Record<string, string>;  // Backend field-level validation errors
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
