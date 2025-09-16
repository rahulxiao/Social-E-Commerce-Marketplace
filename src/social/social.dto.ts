import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsEnum,
} from 'class-validator';
import { ActivityType } from './activity.entity';

export class FollowUserDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  followingId: number;
}

export class FollowResponseDto {
  id: number;
  follower: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  following: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  createdAt: Date;
}

export class UserProfileDto {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  address?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  createdAt: Date;
}

export class ActivityResponseDto {
  id: number;
  type: ActivityType;
  description: string;
  metadata?: any;
  buyer: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  product?: {
    id: number;
    title: string;
    category: string;
    price: number;
  };
  order?: {
    id: number;
    orderNumber: string;
  };
  review?: {
    id: number;
    rating: number;
    comment?: string;
  };
  createdAt: Date;
}

export class ActivityFeedDto {
  activities: ActivityResponseDto[];
  totalActivities: number;
  hasMore: boolean;
}

export class SocialStatsDto {
  followersCount: number;
  followingCount: number;
  totalActivities: number;
  recentActivity: ActivityResponseDto[];
}
