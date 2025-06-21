import { Expose, Type } from 'class-transformer';
import { Account } from '@/entities/account.entity';
import { UserResponseDto } from '@/modules/users/dtos/user.response.dto';

export class AccountUsersResponseDto {
  @Expose()
  uuid: string;

  @Expose({ name: 'users' })
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  constructor(accountUser: Account) {
    this.uuid = accountUser.uuid;
    this.users = [];
console.log(accountUser)
    if (accountUser.users && accountUser.users.length > 0) {
      this.users = accountUser.users.map(
        (user) => new UserResponseDto(user)
      );
    }
  }
}
