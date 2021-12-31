import { IsEmail, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}
