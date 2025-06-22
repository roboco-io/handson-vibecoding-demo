import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthRepository } from '../../domain/user/auth.repository';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly cognitoClient: CognitoIdentityProviderClient,
    private readonly clientId: string,
    private readonly userPoolId: string,
  ) {}

  async signUp(email: string, password: string): Promise<{ userId: string }> {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
    });

    const response = await this.cognitoClient.send(command);

    if (!response.UserSub) {
      throw new Error('Sign up failed: no user sub returned.');
    }

    return { userId: response.UserSub };
  }

  async signIn(email: string, password: string): Promise<string> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await this.cognitoClient.send(command);

    if (!response.AuthenticationResult?.AccessToken) {
      throw new Error('Sign in failed: no authentication result.');
    }

    return response.AuthenticationResult.AccessToken;
  }
}
