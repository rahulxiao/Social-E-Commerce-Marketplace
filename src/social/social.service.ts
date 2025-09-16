import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';
import { ActivityEntity, ActivityType } from './activity.entity';
import { BuyerEntity } from '../buyer/buyer.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';
import { ReviewEntity } from '../review/review.entity';
import { FollowUserDto, FollowResponseDto, UserProfileDto, ActivityResponseDto, ActivityFeedDto, SocialStatsDto } from './social.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
    @InjectRepository(BuyerEntity)
    private readonly buyerRepository: Repository<BuyerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  // Follow a user
  async followUser(followerId: number, followUserDto: FollowUserDto): Promise<FollowResponseDto> {
    const { followingId } = followUserDto;

    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Check if target user exists
    const followingUser = await this.buyerRepository.findOne({
      where: { id: followingId },
    });

    if (!followingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if already following
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new BadRequestException('You are already following this user');
    }

    // Create follow relationship
    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    const savedFollow = await this.followRepository.save(follow);

    // Create activity
    await this.createActivity(followerId, ActivityType.FOLLOW, `Started following ${followingUser.fullName}`, {
      followingUserId: followingId,
      followingUserName: followingUser.fullName,
    });

    return this.getFollowById(savedFollow.id);
  }

  // Unfollow a user
  async unfollowUser(followerId: number, followingId: number): Promise<{ message: string }> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
      relations: ['following'],
    });

    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }

    await this.followRepository.remove(follow);

    return { message: 'Successfully unfollowed user' };
  }

  // Get follow relationship by ID
  async getFollowById(followId: number): Promise<FollowResponseDto> {
    const follow = await this.followRepository.findOne({
      where: { id: followId },
      relations: ['follower', 'following'],
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    return {
      id: follow.id,
      follower: {
        id: follow.follower.id,
        fullName: follow.follower.fullName,
        avatarUrl: follow.follower.avatarUrl || undefined,
      },
      following: {
        id: follow.following.id,
        fullName: follow.following.fullName,
        avatarUrl: follow.following.avatarUrl || undefined,
      },
      createdAt: follow.createdAt,
    };
  }

  // Get user profile with social stats
  async getUserProfile(currentUserId: number, userId: number): Promise<UserProfileDto> {
    const user = await this.buyerRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'following'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if current user is following this user
    const isFollowing = await this.followRepository.findOne({
      where: { follower: { id: currentUserId }, following: { id: userId } },
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
      address: user.address || undefined,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing: !!isFollowing,
      createdAt: user.createdAt,
    };
  }

  // Get followers list
  async getFollowers(userId: number, page: number = 1, limit: number = 20): Promise<UserProfileDto[]> {
    const followers = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return followers.map(follow => ({
      id: follow.follower.id,
      fullName: follow.follower.fullName,
      email: follow.follower.email,
      avatarUrl: follow.follower.avatarUrl || undefined,
      address: follow.follower.address || undefined,
      followersCount: 0, // We'll calculate this separately if needed
      followingCount: 0,
      isFollowing: false, // We'll calculate this separately if needed
      createdAt: follow.follower.createdAt,
    }));
  }

  // Get following list
  async getFollowing(userId: number, page: number = 1, limit: number = 20): Promise<UserProfileDto[]> {
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return following.map(follow => ({
      id: follow.following.id,
      fullName: follow.following.fullName,
      email: follow.following.email,
      avatarUrl: follow.following.avatarUrl || undefined,
      address: follow.following.address || undefined,
      followersCount: 0, // We'll calculate this separately if needed
      followingCount: 0,
      isFollowing: false, // We'll calculate this separately if needed
      createdAt: follow.following.createdAt,
    }));
  }

  // Get activity feed for current user (activities from followed users)
  async getActivityFeed(userId: number, page: number = 1, limit: number = 20): Promise<ActivityFeedDto> {
    // Get followed user IDs
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    const followingIds = following.map(f => f.following.id);
    followingIds.push(userId); // Include current user's activities

    // Get activities from followed users
    const activities = await this.activityRepository.find({
      where: followingIds.map(id => ({ buyer: { id } })),
      relations: ['buyer', 'product', 'order', 'review'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit + 1, // Get one extra to check if there are more
    });

    const hasMore = activities.length > limit;
    const activitiesToReturn = hasMore ? activities.slice(0, limit) : activities;

    return {
      activities: activitiesToReturn.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        metadata: activity.metadata,
        buyer: {
          id: activity.buyer.id,
          fullName: activity.buyer.fullName,
          avatarUrl: activity.buyer.avatarUrl || undefined,
        },
        product: activity.product ? {
          id: activity.product.id,
          title: activity.product.title,
          category: activity.product.category,
          price: activity.product.price,
        } : undefined,
        order: activity.order ? {
          id: activity.order.id,
          orderNumber: activity.order.orderNumber,
        } : undefined,
        review: activity.review ? {
          id: activity.review.id,
          rating: activity.review.rating,
          comment: activity.review.comment,
        } : undefined,
        createdAt: activity.createdAt,
      })),
      totalActivities: activitiesToReturn.length,
      hasMore,
    };
  }

  // Get user's social stats
  async getSocialStats(userId: number): Promise<SocialStatsDto> {
    const user = await this.buyerRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'following', 'activities'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get recent activities
    const recentActivities = await this.activityRepository.find({
      where: { buyer: { id: userId } },
      relations: ['buyer', 'product', 'order', 'review'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      followersCount: user.followers.length,
      followingCount: user.following.length,
      totalActivities: user.activities.length,
      recentActivity: recentActivities.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        metadata: activity.metadata,
        buyer: {
          id: activity.buyer.id,
          fullName: activity.buyer.fullName,
          avatarUrl: activity.buyer.avatarUrl || undefined,
        },
        product: activity.product ? {
          id: activity.product.id,
          title: activity.product.title,
          category: activity.product.category,
          price: activity.product.price,
        } : undefined,
        order: activity.order ? {
          id: activity.order.id,
          orderNumber: activity.order.orderNumber,
        } : undefined,
        review: activity.review ? {
          id: activity.review.id,
          rating: activity.review.rating,
          comment: activity.review.comment,
        } : undefined,
        createdAt: activity.createdAt,
      })),
    };
  }

  // Create activity (internal method)
  async createActivity(
    buyerId: number,
    type: ActivityType,
    description: string,
    metadata?: any,
    productId?: number,
    orderId?: number,
    reviewId?: number,
  ): Promise<ActivityEntity> {
    const activity = this.activityRepository.create({
      buyer: { id: buyerId },
      type,
      description,
      metadata,
      product: productId ? { id: productId } : undefined,
      order: orderId ? { id: orderId } : undefined,
      review: reviewId ? { id: reviewId } : undefined,
    });

    return await this.activityRepository.save(activity);
  }

  // Search users
  async searchUsers(query: string, page: number = 1, limit: number = 20): Promise<UserProfileDto[]> {
    const users = await this.buyerRepository
      .createQueryBuilder('buyer')
      .where('buyer.fullName ILIKE :query OR buyer.email ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('buyer.fullName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
      address: user.address || undefined,
      followersCount: 0, // We'll calculate this separately if needed
      followingCount: 0,
      isFollowing: false, // We'll calculate this separately if needed
      createdAt: user.createdAt,
    }));
  }
}
