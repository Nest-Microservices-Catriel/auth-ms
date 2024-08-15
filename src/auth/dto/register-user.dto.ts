import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
  @IsString()
  @IsStrongPassword()
  password: string;
}
