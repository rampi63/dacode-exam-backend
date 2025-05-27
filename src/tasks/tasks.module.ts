import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    JwtModule.register({}),
  ],
  providers: [TasksService, TasksResolver],
  exports: [TypeOrmModule],
})
export class TasksModule {}
