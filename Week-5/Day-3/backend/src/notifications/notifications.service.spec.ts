import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const mockGateway = { emitNotification: jest.fn() } as any;

  beforeEach(() => {
    const notif = {
      _id: 'n1',
      target: 'u1',
      read: false,
      save: jest.fn().mockResolvedValue(true),
    };
    const mockModel: any = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([notif]),
      findById: jest.fn().mockResolvedValue(notif),
      create: jest.fn().mockResolvedValue(notif),
    };
    service = new NotificationsService(mockModel as any, mockGateway);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lists notifications for a user', async () => {
    const list = await service.listForUser('u1');
    expect(Array.isArray(list)).toBe(true);
  });

  it('marks a notification read when owned by user', async () => {
    const res = await service.markRead('n1', 'u1');
    expect(res).toEqual({ ok: true });
  });
});
