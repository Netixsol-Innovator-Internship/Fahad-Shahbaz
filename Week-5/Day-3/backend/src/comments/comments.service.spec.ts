import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationsService } from '../notifications/notifications.service';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const mockModel = {
      findById: jest.fn(),
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    } as any;

    const mockNotifications = { create: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getModelToken('Comment'), useValue: mockModel },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    // manually get service with DI
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
