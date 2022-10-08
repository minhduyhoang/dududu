import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { Language } from '../utils/constant/language.constant';

export class ChangeLanguageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Language))
  language: Language;
}
