// --- Product ---
export interface RepositoryCreateProduct {
  title: string;
  description: string;
  price: string;
  owner_id: unknown;
}

export interface RepositoryUpdateProduct {
  productId: unknown;
  title: string;
  description: string;
  price: string;
  category_id: unknown;
  remove_category?: boolean;
}

export interface RepositoryUpdateManyProducts {
  productIds: unknown[];
  category_id: unknown;
  remove_category?: boolean;
}

// --- Category ---
export interface RepositoryCreateCategory {
  title: string;
  description: string;
  owner_id: unknown;
}
export interface RepositoryUpdateCategory {
  categoryId: unknown;
  title: string;
  description: string;
}

// --- Others ---
export interface UpdateRelationsProps {
  modelId: unknown;
  type: string;
  typeIds: unknown[];
}
