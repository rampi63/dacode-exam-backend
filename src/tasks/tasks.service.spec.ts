import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { Repository } from 'typeorm';

const mockTask = {
  id: '1',
  title: 'Test task',
  description: 'Descripción',
  status: TaskStatus.PENDING,
  user: { id: 'user123' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TasksService', () => {
  let service: TasksService;
  let repo: Repository<Task>;

  const mockTaskRepo = {
    create: jest.fn().mockReturnValue(mockTask),
    save: jest.fn().mockResolvedValue(mockTask),
    findAndCount: jest.fn().mockResolvedValue([[mockTask], 1]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepo,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createTask debe guardar una nueva tarea', async () => {
    const result = await service.createTask('user123', {
      title: 'Test',
      description: 'Algo',
    });

    expect(repo.create).toHaveBeenCalledWith({
      title: 'Test',
      description: 'Algo',
      user: { id: 'user123' },
    });

    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockTask);
  });

  it('getTasks debe retornar tareas paginadas', async () => {
    const result = await service.getTasks('user123', 1, 10);
    expect(repo.findAndCount).toHaveBeenCalled();
    expect(result.tasks).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('getTask debe retornar una tarea específica', async () => {
    const result = await service.getTask('user123', '1');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: '1', user: { id: 'user123' } },
    });
    expect(result).toEqual(mockTask);
  });

  it('updateTask debe guardar cambios', async () => {
    jest.spyOn(service, 'getTask').mockResolvedValueOnce(mockTask as Task);
    const result = await service.updateTask('user123', '1', {
      title: 'Nuevo',
    });

    expect(result).toEqual(mockTask);
  });

  it('deleteTask debe borrar una tarea', async () => {
    jest.spyOn(service, 'getTask').mockResolvedValueOnce(mockTask as Task);
    const result = await service.deleteTask('user123', '1');

    expect(result).toBe(true);
  });
});
