import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request, ValidationPipe, Query } from '@nestjs/common';
import { SocialService } from './social.service';
import { AuthGuard } from '../auth/auth.guard';
import { FollowUserDto } from './social.dto';

@Controller('social')
@UseGuards(AuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('follow')
  followUser(@Request() req, @Body(ValidationPipe) followUserDto: FollowUserDto) {
    return this.socialService.followUser(req.user.sub, followUserDto);
  }

  @Delete('unfollow/:userId')
  unfollowUser(@Request() req, @Param('userId') userId: number) {
    return this.socialService.unfollowUser(req.user.sub, userId);
  }

  @Get('profile/:userId')
  getUserProfile(@Request() req, @Param('userId') userId: number) {
    return this.socialService.getUserProfile(req.user.sub, userId);
  }

  @Get('followers/:userId')
  getFollowers(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.socialService.getFollowers(userId, page, limit);
  }

  @Get('following/:userId')
  getFollowing(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.socialService.getFollowing(userId, page, limit);
  }

  @Get('activity-feed')
  getActivityFeed(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.socialService.getActivityFeed(req.user.sub, page, limit);
  }

  @Get('stats/:userId')
  getSocialStats(@Param('userId') userId: number) {
    return this.socialService.getSocialStats(userId);
  }

  @Get('search')
  searchUsers(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.socialService.searchUsers(query, page, limit);
  }
}
