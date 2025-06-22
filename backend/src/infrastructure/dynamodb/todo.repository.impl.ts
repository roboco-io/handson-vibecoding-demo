import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { TodoRepository } from '../../domain/todo/todo.repository';
import { Todo, TodoProps } from '../../domain/todo/todo.entity';

export class TodoRepositoryImpl implements TodoRepository {
  private readonly tableName: string;

  constructor(
    private readonly ddbDocClient: DynamoDBDocumentClient,
    tableName?: string,
  ) {
    this.tableName = tableName || process.env.TODO_TABLE_NAME || '';
    if (!this.tableName) {
      throw new Error(
        'Table name is not configured. Please set TODO_TABLE_NAME environment variable or pass it to the constructor.',
      );
    }
  }

  async save(todo: Todo): Promise<void> {
    const params = new PutCommand({
      TableName: this.tableName,
      Item: todo.toJSON(),
    });
    await this.ddbDocClient.send(params);
  }

  async findById(id: string): Promise<Todo | null> {
    const params = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    const { Item } = await this.ddbDocClient.send(params);
    if (!Item) {
      return null;
    }
    return Todo.reconstruct(Item as TodoProps);
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const params = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userId-index', // Assuming a GSI on userId
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });
    const { Items } = await this.ddbDocClient.send(params);
    return (Items || []).map((item) => Todo.reconstruct(item as TodoProps));
  }

  async delete(id: string): Promise<void> {
    const params = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });
    await this.ddbDocClient.send(params);
  }
}
