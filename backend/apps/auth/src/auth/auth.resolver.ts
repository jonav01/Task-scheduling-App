import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Query('ping')
  ping() {
    return 'pong';
  }
}
