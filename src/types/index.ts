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

export interface RepositoryCreateProduct {
  title: string;
  description: string;
  price: string;
  owner_id: unknown;
}

// --- Category ---

export interface CreateCategoryProps {
  token: string;
  title: string;
  description: string;
}

export interface RepositoryCreateCategory {
  title: string;
  description: string;
  owner_id: unknown;
}

// --- General ---

export interface UpdateRelationsProps {
  accountId: unknown;
  type: string;
  typeId: unknown;
}
