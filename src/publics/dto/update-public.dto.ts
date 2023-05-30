import { PartialType } from '@nestjs/swagger';
import { CreatePublicDto } from './create-public.dto';

export class UpdatePublicDto extends PartialType(CreatePublicDto) {}
