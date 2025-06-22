import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '@/modules/users/dtos/user.response.dto';
import { User } from '@/entities/user.entity';

export class AccountUsersResponsePaginationDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  last_page: number;

  @Expose()
  limit: number;

  @Expose({ name: 'users' })
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  constructor(accountUsers: { data: User[], total: number, page: number, last_page: number, limit: number }) {
    this.total = accountUsers.total;
    this.page = accountUsers.page;
    this.last_page = accountUsers.last_page;
    this.limit = accountUsers.limit;
    this.users = [];

    if (accountUsers.data && accountUsers.data.length > 0) {
      this.users = accountUsers.data.map(
        (user: User) => new UserResponseDto(user)
      );
    }
  }
}
