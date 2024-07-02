// --- Account ---

export interface CreateAccountProps {
  name: string;
  email: string;
  password: string;
}

export interface LoginAccountProps {
  email: string;
  password: string;
}

export interface GetAccountProps {
  token: string;
}

// --- Product ---

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

// --- Category ---

export interface CreateCategoryProps {
  token: string;
  title: string;
  description: string;
}
