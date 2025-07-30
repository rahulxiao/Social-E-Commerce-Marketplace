import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  placeOrder() {
    return this.orderService.placeOrder();
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
