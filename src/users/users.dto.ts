import { IntersectionType } from '@nestjs/swagger';
import {
  IsEmail, IsIn, IsNotEmpty,
  IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength
} from 'class-validator';
import { Language } from 'src/utils/constant/language.constant';
import { KeywordDto, PaginationDto } from '../utils/dto/pagination.dto';
import { UserRole, UserStatus, UserType } from './users.constant';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(UserRole))
  role: UserRole = UserRole.User;

  @IsString()
  @IsOptional()
  deviceToken: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(Language))
  language: Language = Language.En;
}

export class UserRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  deviceToken: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(Language))
  language: Language = Language.En;
}

export class UserLoginSNSDto {
  @IsNotEmpty()
  @IsIn(Object.values(UserType))
  userType: string;

  @IsNotEmpty()
  @IsString()
  socialToken: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Language))
  language: Language = Language.En;

  @IsOptional()
  @IsString()
  deviceToken: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(8)
  nickname?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  deviceToken?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(UserRole))
  role?: UserRole;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  deviceToken: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  nickname: string;

  @IsOptional()
  @IsString()
  dob: string;
}

export class AdminUpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  deviceToken: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(UserRole))
  role: UserRole;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(UserStatus))
  status: UserStatus;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/, {
    message: 'password too weak',
  })
  @IsOptional()
  password: string;
}

export class GetUsersDto extends IntersectionType(PaginationDto, KeywordDto) {
  @IsString()
  @IsOptional()
  @IsIn(Object.values(UserRole))
  role: UserRole;
}
