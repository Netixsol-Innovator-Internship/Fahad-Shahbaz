import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: any) {
    const user = await this.usersService.findById(id);
    if (!user) return { error: 'not found' };

    // determine if the current authenticated user follows this profile
    let isFollowedByCurrentUser = false;
    // only consider authenticated users (req.user) to determine follow status
    try {
      const actorId = req?.user?.userId;
      if (actorId) {
        const followerIds = (user.followers || []).map((f) => String(f));
        isFollowedByCurrentUser = followerIds.includes(String(actorId));
      }
    } catch (err) {
      // ignore
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowedByCurrentUser,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  async follow(@Req() req: any, @Param('id') id: string) {
    const actorId = req.user?.userId;
    if (!actorId) return { ok: false, error: 'unauthenticated' };
    return this.usersService.follow(actorId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/unfollow')
  async unfollow(@Req() req: any, @Param('id') id: string) {
    const actorId = req.user?.userId;
    if (!actorId) return { ok: false, error: 'unauthenticated' };
    return this.usersService.unfollow(actorId, id);
  }

  @Get(':id/followers')
  async followers(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 50;
    const s = skip ? parseInt(skip, 10) : 0;
    const list = await this.usersService.listFollowers(id, l, s);
    return { ok: true, followers: list };
  }

  @Get(':id/following')
  async following(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 50;
    const s = skip ? parseInt(skip, 10) : 0;
    const list = await this.usersService.listFollowing(id, l, s);
    return { ok: true, following: list };
  }
}
