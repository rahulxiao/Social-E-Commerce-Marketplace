import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from './wishlist.entity';
import { ProductEntity } from '../product/product.entity';
import { AddToWishlistDto, UpdateWishlistItemDto, WishlistResponseDto, WishlistItemResponseDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // Add product to wishlist
  async addToWishlist(buyerId: number, addToWishlistDto: AddToWishlistDto): Promise<WishlistItemResponseDto> {
    const { productId, notes } = addToWishlistDto;

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product is already in wishlist
    const existingItem = await this.wishlistRepository.findOne({
      where: { buyer: { id: buyerId }, product: { id: productId } },
    });

    if (existingItem) {
      throw new ConflictException('Product is already in your wishlist');
    }

    // Create wishlist item
    const wishlistItem = this.wishlistRepository.create({
      buyer: { id: buyerId },
      product: { id: productId },
      notes: notes || undefined,
    });

    const savedItem = await this.wishlistRepository.save(wishlistItem);

    return {
      id: savedItem.id,
      notes: savedItem.notes,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        inStock: product.inStock,
        seller: {
          id: product.seller.id,
          name: product.seller.name,
        },
      },
      createdAt: savedItem.createdAt,
      updatedAt: savedItem.updatedAt,
    };
  }

  // Get buyer's wishlist
  async getWishlist(buyerId: number): Promise<WishlistResponseDto> {
    const wishlistItems = await this.wishlistRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['product', 'product.seller'],
      order: { createdAt: 'DESC' },
    });

    return {
      items: wishlistItems.map(item => ({
        id: item.id,
        notes: item.notes,
        product: {
          id: item.product.id,
          title: item.product.title,
          description: item.product.description,
          category: item.product.category,
          price: item.product.price,
          stock: item.product.stock,
          inStock: item.product.inStock,
          seller: {
            id: item.product.seller.id,
            name: item.product.seller.name,
          },
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      totalItems: wishlistItems.length,
    };
  }

  // Update wishlist item
  async updateWishlistItem(buyerId: number, itemId: number, updateDto: UpdateWishlistItemDto): Promise<WishlistItemResponseDto> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { id: itemId, buyer: { id: buyerId } },
      relations: ['product', 'product.seller'],
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    // Update notes
    if (updateDto.notes !== undefined) {
      wishlistItem.notes = updateDto.notes;
    }

    const updatedItem = await this.wishlistRepository.save(wishlistItem);

    return {
      id: updatedItem.id,
      notes: updatedItem.notes,
      product: {
        id: updatedItem.product.id,
        title: updatedItem.product.title,
        description: updatedItem.product.description,
        category: updatedItem.product.category,
        price: updatedItem.product.price,
        stock: updatedItem.product.stock,
        inStock: updatedItem.product.inStock,
        seller: {
          id: updatedItem.product.seller.id,
          name: updatedItem.product.seller.name,
        },
      },
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
    };
  }

  // Remove product from wishlist
  async removeFromWishlist(buyerId: number, itemId: number): Promise<{ message: string }> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { id: itemId, buyer: { id: buyerId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.wishlistRepository.remove(wishlistItem);

    return { message: 'Product removed from wishlist successfully' };
  }

  // Remove product from wishlist by product ID
  async removeProductFromWishlist(buyerId: number, productId: number): Promise<{ message: string }> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { buyer: { id: buyerId }, product: { id: productId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.wishlistRepository.remove(wishlistItem);

    return { message: 'Product removed from wishlist successfully' };
  }

  // Check if product is in wishlist
  async isProductInWishlist(buyerId: number, productId: number): Promise<boolean> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { buyer: { id: buyerId }, product: { id: productId } },
    });

    return !!wishlistItem;
  }

  // Clear entire wishlist
  async clearWishlist(buyerId: number): Promise<{ message: string }> {
    await this.wishlistRepository.delete({ buyer: { id: buyerId } });

    return { message: 'Wishlist cleared successfully' };
  }
}
