import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionsModule } from '../sessions/sessions.module';
import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => SessionsModule), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
