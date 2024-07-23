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

export interface CreateProductProps {
  token: string;
  title: string;
  description: string;
  price: string;
}

export interface EditProductProps {
  token: string;
  productId: string;
  data: {
    title?: string;
    description?: string;
    price?: string;
    category_id?: string;
    remove_category?: boolean;
  };
}

export interface DeleteProductProps {
  token: string;
  productId: string;
}
