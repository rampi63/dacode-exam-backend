import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
    ) { }

    async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
        const task = this.taskRepo.create({
            ...input,
            user: { id: userId },
        });

        return await this.taskRepo.save(task);
    }

    async getTasks(userId: string, page = 1, limit = 10): Promise<{ tasks: Task[]; total: number }> {
        const [tasks, total] = await this.taskRepo.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { tasks, total };
    }

    async getTask(userId: string, id: string): Promise<Task> {
        const task = await this.taskRepo.findOne({
            where: { id, user: { id: userId } },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async updateTask(userId: string, id: string, input: UpdateTaskInput): Promise<Task> {
        const task = await this.getTask(userId, id);

        Object.assign(task, input);
        return await this.taskRepo.save(task);
    }

    async deleteTask(userId: string, id: string): Promise<boolean> {
        const task = await this.getTask(userId, id);
        await this.taskRepo.remove(task);
        return true;
    }
}
