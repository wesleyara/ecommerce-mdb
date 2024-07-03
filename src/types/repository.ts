// --- Product ---
export interface RepositoryCreateProduct {
  title: string;
  description: string;
  price: string;
  owner_id: string;
}

export interface RepositoryUpdateProduct {
  productId: string;
  data: {
    title: string | undefined;
    description: string | undefined;
    price: string | undefined;
    categoryId: string | undefined;
  };
  remove_category?: boolean;
}

export interface RepositoryUpdateManyProducts {
  productIds: string[];
  category_id: string;
  remove_category?: boolean;
}

// --- Category ---
export interface RepositoryCreateCategory {
  title: string;
  description: string;
  owner_id: string;
}
export interface RepositoryUpdateCategory {
  categoryId: string;
  data: {
    title: string | undefined;
    description: string | undefined;
    productIds: string[] | undefined;
  };
  remove_products: boolean;
}

// --- Others ---
export interface UpdateRelationsProps {
  modelId: string;
  type: string;
  typeIds: string[];
}
