import { IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { LANGUAGE } from 'src/utils/constant/constant';
import { KeywordDto, PaginationDto } from '../../utils/dto/pagination.dto';
import { USER_ROLE, USER_STATUS, USER_TYPE } from '../users.constant';

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
  @IsIn(Object.values(USER_ROLE))
  role: USER_ROLE = USER_ROLE.USER;

  @IsString()
  @IsOptional()
  deviceToken: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(LANGUAGE))
  language: LANGUAGE = LANGUAGE.EN;
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
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(LANGUAGE))
  language: LANGUAGE = LANGUAGE.EN;
}

export class UserLoginSNSDto {
  @IsNotEmpty()
  @IsIn(Object.values(USER_TYPE))
  userType: string;

  @IsNotEmpty()
  @IsString()
  socialToken: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(LANGUAGE))
  language: LANGUAGE = LANGUAGE.EN;

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
  @IsIn(Object.values(USER_ROLE))
  role?: USER_ROLE;
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
  @IsIn(Object.values(USER_ROLE))
  role: USER_ROLE;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(USER_STATUS))
  status: USER_STATUS;

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
  @IsIn(Object.values(USER_ROLE))
  role: USER_ROLE;
}

export class CreateOneDto {
  @IsOptional()
  name: number;

  @IsOptional()
  order: number;
}

export class CreateManyDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOneDto)
  users: CreateOneDto[];
}
