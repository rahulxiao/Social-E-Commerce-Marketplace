import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CartItemEntity } from './cart-item.entity';
import { ProductEntity } from '../product/product.entity';
import { AddToCartDto, UpdateCartItemDto, CartResponseDto, CartItemResponseDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // Get or create active cart for buyer
  async getOrCreateCart(buyerId: number): Promise<CartEntity> {
    let cart = await this.cartRepository.findOne({
      where: { buyer: { id: buyerId }, isActive: true },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        buyer: { id: buyerId },
        totalAmount: 0,
        totalItems: 0,
        isActive: true,
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  // Add item to cart
  async addToCart(buyerId: number, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and is in stock
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.inStock || product.stock < quantity) {
      throw new BadRequestException('Product is out of stock or insufficient quantity');
    }

    // Get or create cart
    const cart = await this.getOrCreateCart(buyerId);

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock for requested quantity');
      }
      
      existingItem.quantity = newQuantity;
      existingItem.totalPrice = existingItem.unitPrice * newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create new cart item
      const cartItem = this.cartItemRepository.create({
        cart: { id: cart.id },
        product: { id: productId },
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    // Update cart totals
    await this.updateCartTotals(cart.id);

    return this.getCart(buyerId);
  }

  // Get cart with items
  async getCart(buyerId: number): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(buyerId);

    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cart.id } },
      relations: ['product'],
    });

    return {
      id: cart.id,
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      isActive: cart.isActive,
      cartItems: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          stock: item.product.stock,
          inStock: item.product.inStock,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  // Update cart item quantity
  async updateCartItem(buyerId: number, itemId: number, updateDto: UpdateCartItemDto): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(buyerId);
    
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stock < updateDto.quantity) {
      throw new BadRequestException('Insufficient stock for requested quantity');
    }

    cartItem.quantity = updateDto.quantity;
    cartItem.totalPrice = cartItem.unitPrice * updateDto.quantity;
    await this.cartItemRepository.save(cartItem);

    await this.updateCartTotals(cart.id);
    return this.getCart(buyerId);
  }

  // Remove item from cart
  async removeFromCart(buyerId: number, itemId: number): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCart(buyerId);
    
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    await this.updateCartTotals(cart.id);

    return this.getCart(buyerId);
  }

  // Clear cart
  async clearCart(buyerId: number): Promise<{ message: string }> {
    const cart = await this.getOrCreateCart(buyerId);
    
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    await this.updateCartTotals(cart.id);

    return { message: 'Cart cleared successfully' };
  }

  // Update cart totals
  private async updateCartTotals(cartId: number): Promise<void> {
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cartId } },
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    await this.cartRepository.update(cartId, {
      totalAmount,
      totalItems,
    });
  }
}
