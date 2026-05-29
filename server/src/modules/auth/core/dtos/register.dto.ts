import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../persistence/postgres/entities/user.orm.entity';

export class RegisterDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
