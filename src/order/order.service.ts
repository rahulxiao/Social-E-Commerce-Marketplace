import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { CartEntity } from '../cart/cart.entity';
import { CartItemEntity } from '../cart/cart-item.entity';
import { ProductEntity } from '../product/product.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto, OrderItemResponseDto, OrderHistoryResponseDto } from './order.dto';
import { ActivityEntity, ActivityType } from '../social/activity.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {}

  // Create order from cart
  async createOrderFromCart(buyerId: number, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Get buyer's active cart
    const cart = await this.cartRepository.findOne({
      where: { buyer: { id: buyerId }, isActive: true },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException('No active cart found');
    }

    if (cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock availability
    for (const cartItem of cart.cartItems) {
      if (cartItem.product.stock < cartItem.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${cartItem.product.title}`);
      }
    }

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order
    const order = this.orderRepository.create({
      buyer: { id: buyerId },
      orderNumber,
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items and update product stock
    for (const cartItem of cart.cartItems) {
      // Create order item
      const orderItem = this.orderItemRepository.create({
        order: { id: savedOrder.id },
        product: { id: cartItem.product.id },
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        totalPrice: cartItem.totalPrice,
        productTitle: cartItem.product.title,
        productCategory: cartItem.product.category,
      });
      await this.orderItemRepository.save(orderItem);

      // Update product stock
      await this.productRepository.update(cartItem.product.id, {
        stock: cartItem.product.stock - cartItem.quantity,
        inStock: cartItem.product.stock - cartItem.quantity > 0,
      });
    }

    // Clear cart
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    await this.cartRepository.update(cart.id, {
      totalAmount: 0,
      totalItems: 0,
    });

    // Create activity for the purchase
    await this.activityRepository.save({
      buyer: { id: buyerId },
      type: ActivityType.PURCHASE,
      description: `Purchased ${cart.totalItems} item(s) for $${cart.totalAmount}`,
      metadata: {
        orderNumber: savedOrder.orderNumber,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
        productTitles: cart.cartItems.map(item => item.product.title),
      },
      order: { id: savedOrder.id },
    });

    return this.getOrderById(savedOrder.id);
  }

  // Get order by ID
  async getOrderById(orderId: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      status: order.status,
      shippingAddress: order.shippingAddress,
      notes: order.notes,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        productTitle: item.productTitle,
        productCategory: item.productCategory,
        product: item.product ? {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          stock: item.product.stock,
          inStock: item.product.inStock,
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  // Get buyer's order history
  async getOrderHistory(buyerId: number): Promise<OrderHistoryResponseDto> {
    const orders = await this.orderRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });

    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    return {
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        totalItems: order.totalItems,
        status: order.status,
        shippingAddress: order.shippingAddress,
        notes: order.notes,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        cancelledAt: order.cancelledAt,
        orderItems: order.orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          productTitle: item.productTitle,
          productCategory: item.productCategory,
          product: item.product ? {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            stock: item.product.stock,
            inStock: item.product.inStock,
          } : null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      totalOrders: orders.length,
      totalAmount,
    };
  }

  // Update order status
  async updateOrderStatus(orderId: number, updateDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update status and timestamps
    const updateData: Partial<OrderEntity> = { status: updateDto.status };
    
    if (updateDto.status === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    } else if (updateDto.status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (updateDto.status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    await this.orderRepository.update(orderId, updateData);

    return this.getOrderById(orderId);
  }

  // Cancel order (only if pending)
  async cancelOrder(buyerId: number, orderId: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, buyer: { id: buyerId } },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore product stock
    for (const orderItem of order.orderItems) {
      if (orderItem.product) {
        await this.productRepository.update(orderItem.product.id, {
          stock: orderItem.product.stock + orderItem.quantity,
          inStock: true,
        });
      }
    }

    // Update order status
    await this.orderRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
      cancelledAt: new Date(),
    });

    return this.getOrderById(orderId);
  }

  // Generate unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}
