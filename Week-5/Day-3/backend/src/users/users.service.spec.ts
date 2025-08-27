import { UsersService } from './users.service';
import mongoose from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  const mockNotifications = { create: jest.fn() } as any;

  beforeEach(() => {
    // make ObjectId return the raw value for easier testing
    jest
      .spyOn(mongoose.Types, 'ObjectId' as any)
      .mockImplementation((v: any) => v);

    const actor = {
      _id: 'a1',
      following: [],
      save: jest.fn().mockResolvedValue(true),
    };
    const target = {
      _id: 't1',
      followers: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const mockModel: any = {
      findOne: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockImplementation((id: string) => {
        if (String(id) === 'a1') return Promise.resolve(actor);
        if (String(id) === 't1') return Promise.resolve(target);
        return Promise.resolve(null);
      }),
    };

    service = new UsersService(mockModel as any, mockNotifications);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockNotifications.create.mockClear();
  });

  it('follows and creates a notification', async () => {
    const res = await service.follow('a1', 't1');
    expect(res).toEqual({ ok: true });
    expect(mockNotifications.create).toHaveBeenCalled();
  });

  it('unfollows successfully', async () => {
    // perform follow then unfollow
    await service.follow('a1', 't1');
    const res = await service.unfollow('a1', 't1');
    expect(res).toEqual({ ok: true });
  });
});
