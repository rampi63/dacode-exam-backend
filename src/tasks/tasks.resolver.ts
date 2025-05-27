import {
    Resolver,
    Mutation,
    Args,
    Query,
    Context,
    Int,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guards';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './task.entity';
import { PaginatedTasks } from './dto/paginated-tasks.response';

@Resolver(() => Task)
export class TasksResolver {
    constructor(private readonly tasksService: TasksService) { }

    @Query(() => PaginatedTasks)
    @UseGuards(GqlAuthGuard)
    async getTasks(
        @Context() context: any,
        @Args('page', { type: () => Int, nullable: true }) page = 1,
        @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    ): Promise<PaginatedTasks> {
        const userId = context.user.sub;
        return this.tasksService.getTasks(userId, page, limit);
    }

    @Query(() => Task)
    @UseGuards(GqlAuthGuard)
    async getTask(
        @Context() context: any,
        @Args('id', { type: () => String }) id: string,
    ): Promise<Task> {
        const userId = context.user.sub;
        return this.tasksService.getTask(userId, id);
    }

    @Mutation(() => Task)
    @UseGuards(GqlAuthGuard)
    async createTask(
        @Context() context: any,
        @Args('input') input: CreateTaskInput,
    ): Promise<Task> {
        const userId = context.user.sub;
        return this.tasksService.createTask(userId, input);
    }

    @Mutation(() => Task)
    @UseGuards(GqlAuthGuard)
    async updateTask(
        @Context() context: any,
        @Args('id') id: string,
        @Args('input') input: UpdateTaskInput,
    ): Promise<Task> {
        const userId = context.user.sub;
        return this.tasksService.updateTask(userId, id, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async deleteTask(
        @Context() context: any,
        @Args('id') id: string,
    ): Promise<boolean> {
        const userId = context.user.sub;
        return this.tasksService.deleteTask(userId, id);
    }
}
