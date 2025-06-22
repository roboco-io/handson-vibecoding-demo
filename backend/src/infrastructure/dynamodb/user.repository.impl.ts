import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserRepository } from '../../domain/user/user.repository';
import { User, UserProps } from '../../domain/user/user.entity';

export class UserRepositoryImpl implements UserRepository {
  private readonly tableName: string;

  constructor(
    private readonly ddbDocClient: DynamoDBDocumentClient,
    tableName?: string,
  ) {
    this.tableName = tableName || process.env.USER_TABLE_NAME || '';
    if (!this.tableName) {
      throw new Error(
        'Table name is not configured. Please set USER_TABLE_NAME environment variable or pass it to the constructor.',
      );
    }
  }

  async save(user: User): Promise<void> {
    const params = new PutCommand({
      TableName: this.tableName,
      Item: user.toJSON(),
    });
    await this.ddbDocClient.send(params);
  }

  async findById(id: string): Promise<User | null> {
    const params = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    const { Item } = await this.ddbDocClient.send(params);
    if (!Item) {
      return null;
    }
    return User.reconstruct(Item as UserProps);
  }

  async findByEmail(email: string): Promise<User | null> {
    const params = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'email-index', // Assuming a GSI on email
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });
    const { Items } = await this.ddbDocClient.send(params);
    if (!Items || Items.length === 0) {
      return null;
    }
    return User.reconstruct(Items[0] as UserProps);
  }

  async delete(id: string): Promise<void> {
    const params = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });
    await this.ddbDocClient.send(params);
  }
}
