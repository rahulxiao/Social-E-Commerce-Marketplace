import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  createReview(@Request() req, @Body(ValidationPipe) createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(req.user.sub, createReviewDto);
  }

  @Get('my-reviews')
  getMyReviews(@Request() req) {
    return this.reviewService.getBuyerReviewHistory(req.user.sub);
  }

  @Get('product/:productId')
  getProductReviews(
    @Param('productId') productId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.getProductReviews(productId, page, limit);
  }

  @Get('product/:productId/stats')
  getProductReviewStats(@Param('productId') productId: number) {
    return this.reviewService.getProductReviewStats(productId);
  }

  @Get('can-review/:productId')
  canReviewProduct(@Request() req, @Param('productId') productId: number) {
    return this.reviewService.canReviewProduct(req.user.sub, productId);
  }

  @Get(':reviewId')
  getReviewById(@Param('reviewId') reviewId: number) {
    return this.reviewService.getReviewById(reviewId);
  }

  @Put(':reviewId')
  updateReview(
    @Request() req,
    @Param('reviewId') reviewId: number,
    @Body(ValidationPipe) updateDto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(req.user.sub, reviewId, updateDto);
  }

  @Delete(':reviewId')
  deleteReview(@Request() req, @Param('reviewId') reviewId: number) {
    return this.reviewService.deleteReview(req.user.sub, reviewId);
  }
}
