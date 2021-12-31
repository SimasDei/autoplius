import { IsEmail } from 'class-validator';

export class FindAllUsersDto {
  @IsEmail()
  email?: string;
}
