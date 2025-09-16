import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';
import { OrderItemEntity } from '../order/order-item.entity';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ProductReviewStatsDto, BuyerReviewHistoryDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  // Create review for purchased product
  async createReview(buyerId: number, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    const { rating, comment, productId, orderId } = createReviewDto;

    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify order exists and belongs to buyer
    const order = await this.orderRepository.findOne({
      where: { id: orderId, buyer: { id: buyerId } },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify product was actually purchased in this order
    const orderItem = order.orderItems.find(item => item.product.id === productId);
    if (!orderItem) {
      throw new BadRequestException('Product was not purchased in this order');
    }

    // Check if review already exists for this product and order
    const existingReview = await this.reviewRepository.findOne({
      where: { buyer: { id: buyerId }, product: { id: productId }, order: { id: orderId } },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this product and order');
    }

    // Create review
    const review = this.reviewRepository.create({
      buyer: { id: buyerId },
      product: { id: productId },
      order: { id: orderId },
      rating,
      comment: comment || undefined,
      isVerified: true, // Verified since it's from a real purchase
    });

    const savedReview = await this.reviewRepository.save(review);

    return this.getReviewById(savedReview.id);
  }

  // Get review by ID
  async getReviewById(reviewId: number): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, isVisible: true },
      relations: ['buyer', 'product', 'order'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isVerified: review.isVerified,
      isVisible: review.isVisible,
      buyer: {
        id: review.buyer.id,
        fullName: review.buyer.fullName,
        avatarUrl: review.buyer.avatarUrl || undefined,
      },
      product: {
        id: review.product.id,
        title: review.product.title,
        category: review.product.category,
      },
      order: {
        id: review.order.id,
        orderNumber: review.order.orderNumber,
      },
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  // Update review (only by the buyer who created it)
  async updateReview(buyerId: number, reviewId: number, updateDto: UpdateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, buyer: { id: buyerId } },
    });

    if (!review) {
      throw new NotFoundException('Review not found or you do not have permission to update it');
    }

    // Update fields
    if (updateDto.rating !== undefined) {
      review.rating = updateDto.rating;
    }
    if (updateDto.comment !== undefined) {
      review.comment = updateDto.comment;
    }

    const updatedReview = await this.reviewRepository.save(review);

    return this.getReviewById(updatedReview.id);
  }

  // Delete review (only by the buyer who created it)
  async deleteReview(buyerId: number, reviewId: number): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, buyer: { id: buyerId } },
    });

    if (!review) {
      throw new NotFoundException('Review not found or you do not have permission to delete it');
    }

    await this.reviewRepository.remove(review);

    return { message: 'Review deleted successfully' };
  }

  // Get reviews for a specific product
  async getProductReviews(productId: number, page: number = 1, limit: number = 10): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId }, isVisible: true },
      relations: ['buyer', 'product', 'order'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isVerified: review.isVerified,
      isVisible: review.isVisible,
      buyer: {
        id: review.buyer.id,
        fullName: review.buyer.fullName,
        avatarUrl: review.buyer.avatarUrl || undefined,
      },
      product: {
        id: review.product.id,
        title: review.product.title,
        category: review.product.category,
      },
      order: {
        id: review.order.id,
        orderNumber: review.order.orderNumber,
      },
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
  }

  // Get review statistics for a product
  async getProductReviewStats(productId: number): Promise<ProductReviewStatsDto> {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId }, isVisible: true },
    });

    const totalReviews = reviews.length;
    const verifiedReviews = reviews.filter(r => r.isVerified).length;
    
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length,
    };

    return {
      productId,
      totalReviews,
      averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      ratingDistribution,
      verifiedReviews,
    };
  }

  // Get buyer's review history
  async getBuyerReviewHistory(buyerId: number): Promise<BuyerReviewHistoryDto> {
    const reviews = await this.reviewRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['buyer', 'product', 'order'],
      order: { createdAt: 'DESC' },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    return {
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isVerified: review.isVerified,
        isVisible: review.isVisible,
        buyer: {
          id: review.buyer.id,
          fullName: review.buyer.fullName,
          avatarUrl: review.buyer.avatarUrl || undefined,
        },
        product: {
          id: review.product.id,
          title: review.product.title,
          category: review.product.category,
        },
        order: {
          id: review.order.id,
          orderNumber: review.order.orderNumber,
        },
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      totalReviews,
      averageRating: Math.round(averageRating * 100) / 100,
    };
  }

  // Check if buyer can review a product (has purchased it)
  async canReviewProduct(buyerId: number, productId: number): Promise<{ canReview: boolean; purchasedOrders: any[] }> {
    // Find orders where buyer purchased this product
    const orderItems = await this.orderItemRepository.find({
      where: { product: { id: productId } },
      relations: ['order', 'order.buyer'],
    });

    const purchasedOrders = orderItems
      .filter(item => item.order.buyer.id === buyerId)
      .map(item => ({
        orderId: item.order.id,
        orderNumber: item.order.orderNumber,
        quantity: item.quantity,
        purchasedAt: item.order.createdAt,
      }));

    // Check if buyer has already reviewed this product
    const existingReview = await this.reviewRepository.findOne({
      where: { buyer: { id: buyerId }, product: { id: productId } },
    });

    return {
      canReview: purchasedOrders.length > 0 && !existingReview,
      purchasedOrders,
    };
  }
}
