import { Test, TestingModule } from '@nestjs/testing';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { ExecutionContext } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guards';

describe('TasksResolver', () => {
  let resolver: TasksResolver;

  const mockTasksService = {
    createTask: jest.fn(),
    getTasks: jest.fn(),
    getTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksResolver,
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    resolver = module.get<TasksResolver>(TasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});