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

export interface CreateCategoryProps {
  token: string;
  title: string;
  description: string;
}

export interface UpdateCategoryProps {
  token: string;
  categoryId: string;
  data: {
    title?: string;
    description?: string;
    productIds?: string[];
    remove_products?: boolean;
  };
}
