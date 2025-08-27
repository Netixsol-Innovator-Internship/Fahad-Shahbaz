import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const mockCommentsService = {} as any;
    const mockCommentsGateway = {} as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        {
          provide: require('./comments.gateway').CommentsGateway,
          useValue: mockCommentsGateway,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
