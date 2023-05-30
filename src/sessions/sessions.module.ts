import { forwardRef, Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions } from './entities/session.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions]), forwardRef(() => UsersModule)],
  providers: [SessionsService],
  exports: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
