export interface CreateAccountDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginAccountDto {
  email: string;
  password: string;
}
