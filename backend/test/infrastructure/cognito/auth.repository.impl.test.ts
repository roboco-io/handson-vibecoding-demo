import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';
import { AuthRepositoryImpl } from '../../../src/infrastructure/cognito/auth.repository.impl';

const cognitoMock = mockClient(CognitoIdentityProviderClient);

describe('AuthRepositoryImpl', () => {
  let authRepository: AuthRepositoryImpl;
  const clientId = 'test-client-id';
  const userPoolId = 'test-user-pool-id';

  beforeEach(() => {
    cognitoMock.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authRepository = new AuthRepositoryImpl(cognitoMock as any, clientId, userPoolId);
  });

  describe('signUp', () => {
    it('should sign up a user and return the user sub', async () => {
      cognitoMock.on(SignUpCommand).resolves({ UserSub: 'user-sub-123' });

      const result = await authRepository.signUp('test@example.com', 'Password123!');

      expect(result).toEqual({ userId: 'user-sub-123' });
      const signUpCommand = cognitoMock.calls()[0].args[0] as SignUpCommand;
      expect(signUpCommand.input.ClientId).toEqual(clientId);
      expect(signUpCommand.input.Username).toEqual('test@example.com');
      expect(signUpCommand.input.Password).toEqual('Password123!');
    });

    it('should throw an error if sign up fails', async () => {
      cognitoMock.on(SignUpCommand).resolves({ UserSub: undefined });

      await expect(authRepository.signUp('test@example.com', 'Password123!')).rejects.toThrow(
        'Sign up failed: no user sub returned.',
      );
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return an access token', async () => {
      cognitoMock.on(InitiateAuthCommand).resolves({
        AuthenticationResult: { AccessToken: 'access-token-123' },
      });

      const result = await authRepository.signIn('test@example.com', 'Password123!');

      expect(result).toEqual('access-token-123');
      const signInCommand = cognitoMock.calls()[0].args[0] as InitiateAuthCommand;
      expect(signInCommand.input.ClientId).toEqual(clientId);
      expect(signInCommand.input.AuthFlow).toEqual('USER_PASSWORD_AUTH');
      expect(signInCommand.input.AuthParameters).toEqual({
        USERNAME: 'test@example.com',
        PASSWORD: 'Password123!',
      });
    });

    it('should throw an error if sign in fails', async () => {
      cognitoMock.on(InitiateAuthCommand).resolves({
        AuthenticationResult: undefined,
      });

      await expect(authRepository.signIn('test@example.com', 'wrong-password')).rejects.toThrow(
        'Sign in failed: no authentication result.',
      );
    });
  });
});
