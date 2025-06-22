export interface AuthRepository {
  signUp(email: string, password: string): Promise<{ userId: string }>;
  signIn(email: string, password: string): Promise<string>;
}
