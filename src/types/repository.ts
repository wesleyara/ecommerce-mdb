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

// --- Category ---
export interface RepositoryCreateCategory {
  title: string;
  description: string;
  owner_id: unknown;
}

// --- Others ---
export interface UpdateRelationsProps {
  modelId: unknown;
  type: string;
  typeId: unknown;
}
