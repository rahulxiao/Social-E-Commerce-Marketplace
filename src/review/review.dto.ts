import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  comment?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  orderId: number;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  comment?: string;
}

export class ReviewResponseDto {
  id: number;
  rating: number;
  comment?: string;
  isVerified: boolean;
  isVisible: boolean;
  buyer: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  product: {
    id: number;
    title: string;
    category: string;
  };
  order: {
    id: number;
    orderNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ProductReviewStatsDto {
  productId: number;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
}

export class BuyerReviewHistoryDto {
  reviews: ReviewResponseDto[];
  totalReviews: number;
  averageRating: number;
}
