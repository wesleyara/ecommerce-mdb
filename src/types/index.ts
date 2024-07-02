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

// --- Category ---

export interface CreateCategoryProps {
  token: string;
  title: string;
  description: string;
}
