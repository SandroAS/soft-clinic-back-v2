import { Expose, Type } from 'class-transformer';
import { Account } from '@/entities/account.entity';
import { UserResponseDto } from '@/modules/users/dtos/user.response.dto';

export class AccountUsersResponseDto {
  @Expose({ name: 'users' })
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  constructor(account: Account) {
    this.users = [];

    if (account.users && account.users.length > 0) {
      this.users = account.users.map(
        (user) => new UserResponseDto(user)
      );
    }
  }
}
