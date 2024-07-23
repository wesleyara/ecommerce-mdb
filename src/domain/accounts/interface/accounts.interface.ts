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
