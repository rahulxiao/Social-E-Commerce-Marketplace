import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Request() req, @Body(ValidationPipe) createOrderDto: CreateOrderDto) {
    return this.orderService.createOrderFromCart(req.user.sub, createOrderDto);
  }

  @Get()
  getOrderHistory(@Request() req) {
    return this.orderService.getOrderHistory(req.user.sub);
  }

  @Get(':id')
  getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id/status')
  updateOrderStatus(
    @Param('id') id: number,
    @Body(ValidationPipe) updateDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateDto);
  }

  @Delete(':id/cancel')
  cancelOrder(@Request() req, @Param('id') id: number) {
    return this.orderService.cancelOrder(req.user.sub, id);
  }
}
