import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { LANGUAGE } from '../../utils/constant/constant';

export class ChangeLanguageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(LANGUAGE))
  language: LANGUAGE;
}
