export interface Transaction {
  transactionId: number;
  buyer: {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  seller: {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  item: {
    itemId: number;
    name: string;
    price: number;
  };
  transactionDate?: string;
}

export interface PaginatedTransactionsResponse {
  content: Transaction[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
